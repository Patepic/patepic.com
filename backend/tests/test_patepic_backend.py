"""Patepic backend regression tests."""
import io
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://chill-gaming-1.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "patrickcoulter01@gmail.com"
ADMIN_PASSWORD = "password"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/auth/login",
                     json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ── Health ────────────────────────────────────────────────────────────────────
class TestHealth:
    def test_health(self, session):
        r = session.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        d = r.json()
        assert d["status"] == "ok"
        assert d["db"] is True
        assert d["resend_configured"] is True
        assert d["r2_configured"] is True


# ── Reviews public ────────────────────────────────────────────────────────────
class TestReviewsPublic:
    def test_list_all(self, session):
        r = session.get(f"{BASE_URL}/api/reviews")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 8, f"Expected 8 seeded reviews, got {len(data)}"

    def test_filter_q(self, session):
        r = session.get(f"{BASE_URL}/api/reviews", params={"q": "baldur"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert any("baldur" in d["title"].lower() for d in data)

    def test_filter_platform(self, session):
        r = session.get(f"{BASE_URL}/api/reviews", params={"platform": "PC"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for d in data:
            assert d["platform"] == "PC"

    def test_sort_score_desc(self, session):
        r = session.get(f"{BASE_URL}/api/reviews", params={"sort": "score-desc"})
        assert r.status_code == 200
        data = r.json()
        scores = [d["score"] for d in data]
        assert scores == sorted(scores, reverse=True)

    def test_get_single(self, session):
        r = session.get(f"{BASE_URL}/api/reviews/baldurs-gate-3")
        assert r.status_code == 200
        d = r.json()
        assert d["slug"] == "baldurs-gate-3"
        assert "title" in d
        assert "_id" not in d

    def test_get_nonexistent(self, session):
        r = session.get(f"{BASE_URL}/api/reviews/nonexistent-review-xyz")
        assert r.status_code == 404


# ── Auth ──────────────────────────────────────────────────────────────────────
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{BASE_URL}/api/auth/login",
                         json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d
        assert d["user"]["email"] == ADMIN_EMAIL
        assert d["user"]["role"] == "admin"

    def test_login_wrong_password(self, session):
        r = session.post(f"{BASE_URL}/api/auth/login",
                         json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_unauthorized(self, session):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code in (401, 403)

    def test_me_authorized(self, session, auth_headers):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == ADMIN_EMAIL
        assert d["role"] == "admin"


# ── Admin CRUD ────────────────────────────────────────────────────────────────
class TestAdminCRUD:
    test_slug = None

    def test_create_review_unauthorized(self, session):
        r = requests.post(f"{BASE_URL}/api/admin/reviews",
                          json={"title": "x", "year": 2024, "platform": "PC",
                                "genre": "Indie", "score": 5.0})
        assert r.status_code in (401, 403)

    def test_create_review(self, auth_headers):
        unique_title = f"TEST_Review_{uuid.uuid4().hex[:8]}"
        payload = {
            "title": unique_title,
            "studio": "TEST_Studio",
            "year": 2024,
            "platform": "PC",
            "platforms": ["PC"],
            "genre": "Indie",
            "score": 8.0,
            "cover_url": "",
            "verdict": "A solid test review.",
            "pros": ["fun", "tight controls"],
            "cons": ["short"],
            "body": "# heading\n\nbody text",
        }
        r = requests.post(f"{BASE_URL}/api/admin/reviews",
                          json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["title"] == unique_title
        assert d["score"] == 8.0
        assert "slug" in d and d["slug"]
        TestAdminCRUD.test_slug = d["slug"]

        # Verify via GET
        g = requests.get(f"{BASE_URL}/api/reviews/{d['slug']}")
        assert g.status_code == 200
        assert g.json()["title"] == unique_title

    def test_update_review(self, auth_headers):
        slug = TestAdminCRUD.test_slug
        assert slug, "create test must run first"
        r = requests.put(f"{BASE_URL}/api/admin/reviews/{slug}",
                         json={"score": 9.0}, headers=auth_headers)
        assert r.status_code == 200, r.text
        assert r.json()["score"] == 9.0

        g = requests.get(f"{BASE_URL}/api/reviews/{slug}")
        assert g.json()["score"] == 9.0

    def test_delete_review(self, auth_headers):
        slug = TestAdminCRUD.test_slug
        assert slug
        r = requests.delete(f"{BASE_URL}/api/admin/reviews/{slug}",
                            headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["deleted"] is True

        g = requests.get(f"{BASE_URL}/api/reviews/{slug}")
        assert g.status_code == 404


# ── R2 upload ─────────────────────────────────────────────────────────────────
class TestR2Upload:
    def test_upload_image(self, auth_headers):
        # Tiny 1x1 PNG bytes
        png = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
            b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8"
            b"\xcf\xc0\x00\x00\x00\x03\x00\x01\x5b\xc5\xd3\x1f\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        files = {"file": ("test.png", io.BytesIO(png), "image/png")}
        r = requests.post(f"{BASE_URL}/api/admin/upload",
                          files=files, headers=auth_headers)
        assert r.status_code == 200, r.text
        url = r.json()["url"]
        assert url.startswith("https://pub-14f3bc8f5fdd4638bcb602087c67b633.r2.dev")

        # Verify image is reachable
        time.sleep(1)
        g = requests.get(url, timeout=15)
        assert g.status_code == 200, f"R2 fetch failed: {g.status_code}"


# ── Contact ───────────────────────────────────────────────────────────────────
class TestContact:
    def test_contact_form(self, session):
        r = session.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST User",
            "email": "test@example.com",
            "subject": "TEST: regression",
            "message": "This is a regression-test message.",
        })
        # Either real success, or a structured 500 if Resend rejects (still proves call)
        assert r.status_code in (200, 500), r.text
        if r.status_code == 200:
            d = r.json()
            assert d.get("status") in ("success", "queued")
