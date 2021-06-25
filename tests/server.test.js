const request = require("supertest");
const app = require("../app.js");

beforeAll(async () => {
  
});

afterAll(async () => {

});

// The bread and butter
test("hello tests", () => {
  expect(1 + 1).toBe(2);
});

beforeEach(async () => {
  // app.close()
})

// The cream and caramel
describe("GET /", () => {
  it("should return the homepage html", async () => {
    let res = await request(app).get('/')
    expect(res.statusCode).toBe(200)
  });
});

describe("GET /startServer", () => {
  it("should start Bonjour and SocketIO", async () => {
    let res = await request(app).get('/startServer')
    expect(res.statusCode).toBe(200)
  })
})

describe("GET /stopServer", () => {
  it("should stop Bonjour and SocketIO", async () => {
    let res = await request(app).get('/stopServer')
    expect(res.statusCode).toBe(200)
  })
})