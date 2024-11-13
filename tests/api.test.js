import { expect, use } from "chai";
import chaiHttp from "chai-http";

const chai = use(chaiHttp);

const exposedUrl = "http://localhost:8197";

describe("API route test", () => {
  it("should return the initial state", (done) => {
    chai.request
      .execute(exposedUrl)
      .get("/state")
      .auth("testuser", "testpassword")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.a("string");
        expect(res.text).to.equal("INIT");
        done();
      });
  });
});
