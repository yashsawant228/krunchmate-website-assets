"""Backend API tests for KrunchMate FastAPI stub."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to reading from frontend/.env at repo root
    with open("/app/frontend/.env") as fh:
        for line in fh:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health endpoint ----------
class TestHealth:
    def test_health_ok(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("service") == "krunchmate"


# ---------- Subscribe endpoint ----------
class TestSubscribe:
    def test_subscribe_valid_email(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/subscribe",
            json={"email": "TEST_hello@krunchmate.co.uk"},
            timeout=15,
        )
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "subscribed"
        assert data.get("email") == "TEST_hello@krunchmate.co.uk"

    def test_subscribe_invalid_email(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/subscribe",
            json={"email": "not-an-email"},
            timeout=15,
        )
        # Pydantic EmailStr should reject → 422
        assert r.status_code == 422

    def test_subscribe_missing_body(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/subscribe", json={}, timeout=15)
        assert r.status_code == 422
