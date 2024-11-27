import { expect, use } from "chai";
import chaiHttp from "chai-http";

const chai = use(chaiHttp);

const exposedUrl = "http://localhost:8197";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("API route tests", () => {
  afterEach(async function () {
    this.timeout(5000);
    await delay(2500); // Wait for 2,5 seconds after each test to avoid rate limiting
  });

  describe("/state endpoint tests", () => {
    it("Should return INIT before login", function (done) {
      chai.request
        .execute(exposedUrl)
        .get("/state")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text.trim()).to.be.a("string");
          expect(res.text.trim()).to.equal("INIT");
          done();
        });
    });

    it("Should return RUNNING when logged in", function (done) {
      chai.request
        .execute(exposedUrl)
        .get("/")
        .auth("testuser", "testpassword")
        .set("Accept", "text/plain")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text.trim()).to.be.a("string");
          expect(res.text.trim()).to.equal("RUNNING");
          done();
        });
    });

    it("Should change state to SHUTDOWN", function (done) {
      chai.request
        .execute(exposedUrl)
        .put("/state")
        .send("SHUTDOWN")
        .set("Content-Type", "text/plain")
        .set("Accept", "text/plain")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text.trim()).to.be.a("string");
          expect(res.text.trim()).to.equal("SHUTDOWN");
          done();
        });
    });

    it("Should not repond", function (done) {
      chai.request
        .execute(exposedUrl)
        .get("/state")
        .set("Accept", "text/plain")
        .end((err, res) => {
          expect(err).to.not.be.null;
          expect(res).to.be.undefined;
          done();
        });
    });
  });
});
