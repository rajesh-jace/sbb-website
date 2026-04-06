import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./HomePage.css";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [counts, setCounts] = useState({ projects: 0, years: 0, clients: 0 });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/projects`).then((response) => {
      if (response.data.success) setProjects(response.data.data);
    });
  }, []);

  useEffect(() => {
    const targets = { projects: 35, years: 15, clients: 65 };
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCounts({
        projects: Math.round(targets.projects * ease),
        years: Math.round(targets.years * ease),
        clients: Math.round(targets.clients * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, []);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="sbb-home">

      {/* HERO */}
      <section className="sbb-hero">
        <div className="sbb-hero__overlay" />
        <div className="sbb-hero__content">
          <span className="sbb-hero__eyebrow">Est. 2009 · Chennai, Tamil Nadu</span>
          <h1 className="sbb-hero__title">
            Building Dreams,<br />
            <span className="sbb-hero__accent">Crafting Futures</span>
          </h1>
          <p className="sbb-hero__sub">
            Sree Balaji Builders delivers world-class residential &amp; commercial
            spaces with 15+ years of trusted craftsmanship across Tamil Nadu.
          </p>
          <div className="sbb-hero__actions">
            <Link to="/projects" className="sbb-btn sbb-btn--primary">Explore Projects</Link>
            <Link to="/contact" className="sbb-btn sbb-btn--ghost">Get in Touch</Link>
          </div>
        </div>
        <div className="sbb-hero__stats">
          <div className="sbb-stat"><span className="sbb-stat__num">{counts.projects}+</span><span className="sbb-stat__label">Projects Completed</span></div>
          <div className="sbb-stat__divider" />
          <div className="sbb-stat"><span className="sbb-stat__num">{counts.years}+</span><span className="sbb-stat__label">Years of Excellence</span></div>
          <div className="sbb-stat__divider" />
          <div className="sbb-stat"><span className="sbb-stat__num">{counts.clients}+</span><span className="sbb-stat__label">Happy Families</span></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="sbb-marquee"><div className="sbb-marquee__track">
        {["Residential Villas","Commercial Spaces","Plot Development","Renovation Works","Interior Design","Vastu Compliant","Premium Locations",
          "Residential Villas","Commercial Spaces","Plot Development","Renovation Works","Interior Design","Vastu Compliant","Premium Locations"
        ].map((t, i) => <span key={i} className="sbb-marquee__item">◆ {t}</span>)}
      </div></div>

      {/* ABOUT STRIP */}
      <section className="sbb-about-strip">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="sbb-about-strip__img-wrap">
                <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" alt="SBB construction" className="sbb-about-strip__img" />
                <div className="sbb-about-strip__badge"><span className="sbb-about-strip__badge-num">15+</span><span className="sbb-about-strip__badge-text">Years of Trust</span></div>
              </div>
            </Col>
            <Col lg={6}>
              <span className="sbb-section-tag">About SBB</span>
              <h2 className="sbb-section-title">Who We Are</h2>
              <p className="sbb-about-strip__body">Sree Balaji Builders (SBB) is a Chennai-based construction firm renowned for delivering quality homes and commercial spaces. Founded with a commitment to integrity and excellence, we have transformed hundreds of plots into proud properties across Tamil Nadu.</p>
              <p className="sbb-about-strip__body">Every project is backed by experienced engineers, premium materials, and transparent dealings — from foundation to final handover.</p>
              <Link to="/aboutus" className="sbb-btn sbb-btn--primary" style={{display:"inline-block",marginTop:"1.2rem"}}>Know More</Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="sbb-projects-section">
        <Container>
          <div className="sbb-section-header">
            <span className="sbb-section-tag">Our Work</span>
            <h2 className="sbb-section-title">Featured Projects</h2>
            <p className="sbb-section-sub">A glimpse of the spaces we've built with care and precision.</p>
          </div>
          <Row className="g-4">
            {(featuredProjects.length > 0 ? featuredProjects : [{id:1,title:"",description:"",image_urls:[]},{id:2,title:"",description:"",image_urls:[]},{id:3,title:"",description:"",image_urls:[]}]).map((project, idx) => (
              <Col md={6} lg={4} key={project.id || idx}>
                <div className={`sbb-card${project.title ? "" : " sbb-card--loading"}`}>
                  <div className="sbb-card__img-wrap">
                    <img
                      src={project.image_urls?.[0] ? (project.image_urls[0].startsWith("http") ? project.image_urls[0] : `${API_BASE_URL}${project.image_urls[0]}`) : `https://images.unsplash.com/photo-${idx===0?"1600585154340-be6161a56a0c":idx===1?"1580587771525-78b9dba3b914":"1570129477492-45c003edd2be"}?w=600&q=80`}
                      alt={project.title || "Project"}
                      className="sbb-card__img"
                    />
                    {project.status && <span className="sbb-card__status">{project.status}</span>}
                  </div>
                  <div className="sbb-card__body">
                    {project.title ? (
                      <>
                        <h3 className="sbb-card__title">{project.title}</h3>
                        <p className="sbb-card__desc">{project.description.length > 90 ? `${project.description.slice(0,90)}…` : project.description}</p>
                        <Link to={`/projects/${project.id}`} className="sbb-card__link">View Details →</Link>
                      </>
                    ) : (
                      <>
                        <div className="sbb-skeleton sbb-skeleton--title" />
                        <div className="sbb-skeleton sbb-skeleton--text" />
                        <div className="sbb-skeleton sbb-skeleton--text sbb-skeleton--short" />
                      </>
                    )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Link to="/projects" className="sbb-btn sbb-btn--outline">View All Projects</Link>
          </div>
        </Container>
      </section>

      {/* WHY CHOOSE US */}
      <section className="sbb-why">
        <Container>
          <div className="sbb-section-header">
            <span className="sbb-section-tag">Why SBB</span>
            <h2 className="sbb-section-title">What Sets Us Apart</h2>
          </div>
          <Row className="g-4">
            {[
              {icon:"🏗️",title:"15+ Years Experience",desc:"Over a decade and a half of building trust with hundreds of satisfied homeowners."},
              {icon:"🏆",title:"Premium Quality",desc:"Grade-A materials and stringent quality control at every stage of construction."},
              {icon:"🤝",title:"Transparent Dealings",desc:"No hidden costs. Clear timelines and honest communication from day one."},
              {icon:"📐",title:"Vastu Compliant",desc:"All designs thoughtfully crafted to align with Vastu Shastra principles."},
              {icon:"⏱️",title:"On-Time Delivery",desc:"We respect your time — projects delivered as scheduled, every time."},
              {icon:"💬",title:"After-Sales Support",desc:"Our relationship doesn't end at handover. We're always here for you."},
            ].map((item, i) => (
              <Col sm={6} lg={4} key={i}>
                <div className="sbb-why-card">
                  <span className="sbb-why-card__icon">{item.icon}</span>
                  <h4 className="sbb-why-card__title">{item.title}</h4>
                  <p className="sbb-why-card__desc">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="sbb-cta">
        <Container>
          <div className="sbb-cta__inner">
            <div>
              <h2 className="sbb-cta__title">Ready to build your dream space?</h2>
              <p className="sbb-cta__sub">Talk to our experts — free consultation available.</p>
            </div>
            <div className="sbb-cta__actions">
              <Link to="/buildyourproject" className="sbb-btn sbb-btn--white">Build Your Project</Link>
              <Link to="/contact" className="sbb-btn sbb-btn--ghost-white">Contact Us</Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default HomePage;
