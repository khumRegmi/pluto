import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import MainContainer from "../components/layout/MainContainer";
import Slider from "../components/slider/Slider";
import FeaturedProducts from "../components/featured-products/FeaturedProducts";
import PopularProducts from "../components/product/PopularProducts";

export default function Home() {
  return (
    <div>
      <Slider />
      <MainContainer>
        <FeaturedProducts />
        <PopularProducts />
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            to={{
              pathname: "/products",
              search: "?page=1",
              state: { fromDashboard: true },
            }}
          >
            <Button type="primary" style={{ textTransform: "uppercase" }}>
              View all products
            </Button>
          </Link>
        </div>
      </MainContainer>
    </div>
  );
}
