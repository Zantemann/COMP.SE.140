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

  describe("/request endpoint tests", () => {
    it("Should return the correct data structure as plain text", function (done) {
      this.timeout(10000);

      chai.request
        .execute(exposedUrl)
        .get("/")
        .auth("testuser", "testpassword")
        .set("Accept", "text/plain")
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.text.trim()).to.be.a("string");
          expect(res.text.trim()).to.equal("RUNNING");

          setTimeout(() => {
            chai.request
              .execute(exposedUrl)
              .get("/request")
              .set("Accept", "text/plain")
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text.trim()).to.be.a("string");

                const responseData = JSON.parse(res.text.trim());
                expect(responseData).to.have.property("Service1");
                expect(responseData).to.have.property("Service2");
                done();
              });
          }, 2500);
        });
    });
  });

  describe("/run-log endpoint test", function () {
    it("Should return INIT->RUNNING after login", function (done) {
      this.timeout(10000);

      chai.request
        .execute(exposedUrl)
        .get("/run-log")
        .set("Accept", "text/plain")
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.text.trim()).to.be.a("string");
          expect(res.text.trim()).to.include("INIT->RUNNING");
          done();
        });
    });

    it("Should change state to INIT and log out", function (done) {
      this.timeout(10000);

      chai.request
        .execute(exposedUrl)
        .put("/state")
        .send("INIT")
        .set("Content-Type", "text/plain")
        .set("Accept", "text/plain")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text.trim()).to.be.a("string");
          expect(res.text.trim()).to.equal("INIT");

          // Test that can't access /run-log without logging in
          setTimeout(() => {
            chai.request
              .execute(exposedUrl)
              .get("/run-log")
              .set("Accept", "text/plain")
              .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.text.trim()).to.equal("Authorization required");
                done();
              });
          }, 2500);
        });
    });
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

    it("Should not respond", function (done) {
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
