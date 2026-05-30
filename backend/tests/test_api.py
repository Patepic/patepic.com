"""Backend API tests for Frostbyte gaming review site."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://chill-gaming-1.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Health/root endpoints
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data

    def test_health(self, client):
        r = client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["resend_configured"] is False


# Contact form endpoint
class TestContact:
    def test_contact_valid_dev_mode(self, client):
        payload = {
            "name": "TEST User",
            "email": "test@example.com",
            "subject": "Hello",
            "message": "This is a test message",
        }
        r = client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "queued"
        assert data.get("dev_mode") is True

    def test_contact_invalid_email(self, client):
        payload = {
            "name": "TEST User",
            "email": "not-an-email",
            "subject": "Hello",
            "message": "msg",
        }
        r = client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422

    def test_contact_missing_fields(self, client):
        payload = {"name": "TEST"}
        r = client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422

    def test_contact_empty_message(self, client):
        payload = {
            "name": "TEST",
            "email": "a@b.com",
            "subject": "s",
            "message": "",
        }
        r = client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422
