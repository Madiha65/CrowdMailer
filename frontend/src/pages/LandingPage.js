//frontend\src\pages\LandingPage.js
import React from "react";
import '../App.css';
import { FaFacebook, FaInstagramSquare, FaTwitterSquare, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PricingPage from "./PricingPage";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // const handlePlanClick = (planName) => {
  //   if (!user) {
  //     navigate(`/login?redirect=/bank-details&plan=${planName}`);
  //   } else {
  //     navigate(`/bank-details?plan=${planName}`);
  //   }
  // };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>Email Marketing Made Easy</h1>
          <p>
            Send bulk emails, manage subscribers, and track performance effortlessly.
            <br />Simple, powerful tools to grow your business.
          </p>
          <a href="/register" className="cta-btn">Get Started</a>
        </div>


        <div className="hero-right">
          <img src="/assets/hero-banner.png" alt="Email Marketing" />
        </div>
      </section>


      <section className="features" id="features">
        <h2>Why Choose CrowdMailer?</h2>

        <div className="feature-grid">
          {/* Card 1 */}
          <div className="cards">
            <img src="/assets/Campaigns.png" alt="Bulk Campaigns" />
            <div className="card-body">
              <h3 className="card-title">Bulk Campaigns</h3>
            </div>
            <ul>
              <li>Create and send bulk email campaigns easily</li>
              <li>Upload contacts using CSV or manual entry</li>
              <li>Schedule campaigns at the perfect time</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="cards">
            <img src="/assets/management.png" alt="Subscriber Management" />
            <div className="card-body">
              <h3 className="card-title">Subscriber Management</h3>
            </div>
            <ul>
              <li>Add, import, and update subscribers</li>
              <li>Segment audiences for targeted campaigns</li>
              <li>Keep your email list clean and organized</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="cards">
            <img src="/assets/analytics.png" alt="Real-Time Analytics" />
            <div className="card-body">
              <h3 className="card-title">Real-Time Analytics</h3>
            </div>
            <ul>
              <li>Track opens, clicks, and delivery status</li>
              <li>View real-time performance insights</li>
              <li>Improve campaigns using analytics</li>
            </ul>
          </div>
        </div>
      </section>



      {/* HOW IT WORKS */}
      <section className="works" id="about">
        <div className="works-left">
          <h2>Why CrowdMailer Works</h2>
          <p><span class="italic">Trusted</span>by<strong>  1,000+</strong> businesses worldwide</p>




          <ul>
            <li><span>1</span><div><h4>Create Campaign</h4><p>Design your email in minutes.</p></div></li>
            <li><span>2</span><div><h4>Upload Contacts</h4><p>Import subscribers easily.</p></div></li>
            <li><span>3</span><div><h4>Send & Track</h4><p>Monitor opens and clicks.</p></div></li>
          </ul>
        </div>


        <div className="hero-right">
          <img src="/assets/hero-banner.png" alt="Email Marketing" />

          <h2>Powerfull Features for Effective <br /> Email Marketing</h2>
        </div>
      </section>


      {/* POWER FEATURES */}
      <PricingPage />


      <section className="testimonials">
        <h2>What Our Users Say</h2>

        <div className="testimonial-grid">
          {/* Card 1 */}
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>

            <p className="testimonial-text">
              “CrowdMailer made email marketing super easy!”
            </p>

            <div className="user">
              <img
                src="https://i.pravatar.cc/60?img=12"
                alt="Rahul"
              />
              <div>
                <strong>Rahul</strong>
                <span>Startup Founder</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>

            <p className="testimonial-text">
              “Clean UI and great analytics.”
            </p>

            <div className="user">
              <img
                src="https://i.pravatar.cc/60?img=32"
                alt="Ayesha"
              />
              <div>
                <strong>Ayesha</strong>
                <span>Marketing Manager</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="newsletter" id="contact">
  <h2>Stay Updated with CrowdMailer</h2>
  <p>Get product updates, tips, and email marketing insights.</p>

  <div className="newsletter-form">
    <input
      type="email"
      placeholder="Enter your email address"
      required
    />
    <button>Subscribe</button>
  </div>
</section> */}
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-section">
            <h2 class="logo">YourLogo</h2>
            <p>Professional solutions for modern businesses.<br />Empowering your success.</p>
            <p><strong>Email:</strong> info@yourcompany.com</p>
            <p><strong>Phone:</strong> +123 456 7890</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>


          <div class="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2024 YourCompany. All rights reserved.</p>
          <div class="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagramSquare /></a>
            <a href="#"><FaTwitterSquare /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </footer>

    </>
  );
};

export default LandingPage;