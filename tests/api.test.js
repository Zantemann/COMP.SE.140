import { expect, use } from "chai";
import chaiHttp from "chai-http";

const chai = use(chaiHttp);

const exposedUrl = "http://localhost:8197";

describe("API route tests", () => {
  describe("/state endpoint tests", () => {
    it("Should return INIT before login", (done) => {
      chai.request
        .execute(exposedUrl)
        .get("/state")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.a("string");
          expect(res.text).to.equal("INIT");
          done();
        });
    });

    it("Should return RUNNING when logged in", (done) => {
      chai.request
        .execute(exposedUrl)
        .get("/state")
        .auth("testuser", "testpassword")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.a("string");
          expect(res.text).to.equal("RUNNING");
          done();
        });
    });

    it("Should return PAUSED after PUT with PAUSED", (done) => {
      chai.request
        .execute(exposedUrl)
        .put("/state")
        .send({ state: "PAUSED" })
        .auth("testuser", "testpassword")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.a("string");
          expect(res.text).to.equal("PAUSED");
          done();
        });
    });

    it("Should change state to SHUTDOWN and stop responding", (done) => {
      chai.request
        .execute(exposedUrl)
        .put("/state")
        .send({ state: "SHUTDOWN" })
        .auth("testuser", "testpassword")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal("SHUTDOWN");

          setTimeout(() => {
            chai.request
              .execute(exposedUrl)
              .get("/state")
              .end((err, res) => {
                expect(err).to.not.be.null;
                expect(res).to.be.undefined;
                done();
              });
          }, 10000);
        });
    });
  });
});
