import React from "react";
import Title from "./Title";
import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";
import { Carousel, Card, Row, Col } from "antd";

const Testimonial = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 24px",
        background: "#f1f5f9",
      }}
    >
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers consistently choose PolyStay for their exclusive and luxurious accommodations around the world."
      />
      <div style={{ width: "100%", maxWidth: 1000, marginTop: 40 }}>
        <Carousel autoplay dots>
          {[0, 1].map((slide) => (
            <div key={slide}>
              <Row gutter={[16, 16]} justify="center">
                {testimonials.slice(slide * 3, slide * 3 + 3).map((t) => (
                  <Col key={t.id} xs={24} sm={12} md={8}>
                    <Card>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <img
                          style={{ width: 48, height: 48, borderRadius: 9999 }}
                          src={t.image}
                          alt={t.name}
                        />
                        <div>
                          <p style={{ fontSize: 18 }}>{t.name}</p>
                          <p style={{ color: "#6b7280" }}>{t.address}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <StarRating rating={t.rating} />
                      </div>
                      <p style={{ color: "#6b7280", marginTop: 12 }}>
                        "{t.review}"
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonial;
