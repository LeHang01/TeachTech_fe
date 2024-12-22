import React, { Fragment, useEffect, useState } from 'react'; // Make sure to import useState
import { Link } from 'react-router-dom';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.min.css';
import 'owl.carousel/dist/assets/owl.theme.default.min.css';
import 'owl.carousel';
import './Home.css';
import axios from 'axios'; // Nhập Axios

const Home = () => {
  const [message, setMessage] = useState(''); // Define state for the message

  const [courses, setCourses] = useState([]); // Trạng thái lưu trữ danh sách khóa học
  const [loading, setLoading] = useState(true); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Hàm để lấy dữ liệu khóa học từ API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/courses/');
        setCourses(response.data); // Lưu trữ dữ liệu khóa học
      } catch (err) {
        setError(err.message); // Xử lý lỗi
      } finally {
        setLoading(false); // Hoàn thành quá trình tải
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const initializeCarousel = () => {
      if ($ && $.fn.owlCarousel) {
        $('.owl-carousel').owlCarousel({
          items: 1,
          loop: true,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          nav: true,
          dots: false,
        });
      } else {
        console.error('Owl Carousel plugin is not available.');
      }
    };

    setTimeout(initializeCarousel, 100);

    const byline = document.getElementById('byline');
    if (byline) {
      const bylineText = byline.innerHTML;
      byline.innerHTML = '';
      bylineText.split('').forEach((char) => {
        const span = document.createElement('span');
        const letter = document.createTextNode(char);
        char === ' ' ? byline.appendChild(letter) : span.appendChild(letter);
        byline.appendChild(span);
      });
    }
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Update the message state
  };

  const renderClassItem = (
    imgSrc,
    title,
    teacher,
    profilePicture,
    price,
    start_date,
    time,
    total,
  ) => (
    <div className="col-lg-4 col-md-6 wow fadeInUp">
      <div className="classes-item">
        <div className="bg-light rounded-circle w-75 mx-auto p-3">
          <img className="img-fluid rounded-circle" src={imgSrc} alt="" />
        </div>
        <div className="bg-light rounded p-4 pt-5 mt-n5">
          <a className="d-block text-center h3 mt-3 mb-4" href="">
            {title}
          </a>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <img
                className="rounded-circle flex-shrink-0"
                src={`http://127.0.0.1:8000${profilePicture}`}
                alt=""
                style={{ width: '45px', height: '45px' }}
              />
              <div className="ms-3">
                <h6 className="text-primary mb-1">{teacher}</h6>
                <small>Teacher</small>
              </div>
            </div>
            <span className="bg-primary text-white rounded-pill py-2 px-3">{price}</span>
          </div>
          <div className="row g-1">
            <div className="col-4">
              <div className="border-top border-3 border-primary pt-2">
                <h6 className="text-primary mb-1">Start date:</h6>
                <small>{start_date}</small>
              </div>
            </div>
            <div className="col-4">
              <div className="border-top border-3 border-success pt-2">
                <h6 className="text-success mb-1">Time:</h6>
                <small>{time}</small>
              </div>
            </div>
            <div className="col-4">
              <div className="border-top border-3 border-warning pt-2">
                <h6 className="text-warning mb-1">Total:</h6>
                <small>{total}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Xử lý trạng thái tải và lỗi
  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5">
        <div className="header-carousel position-relative">
          <div className="system">
            {/* Solar System Graphics */}
            {/* Example structure for one planet */}
            <div className="sun"></div>
            <div className="mer-path"></div>
            <div className="mer"></div>
            {/* Add other celestial bodies similarly */}
          </div>
          <div className="video-section">
            <div className="video-container">
              <video autoPlay muted loop>
                <source src="img/videoo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
      {/* Carousel End */}

      {/* Classes Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: '600px' }}
          >
            <h1 className="mb-3">School Classes</h1>

          </div>

          <div className="row g-4">
            {courses.map((course) => (
              <Fragment key={course.id}>
                {/* Bọc toàn bộ phần tử của khóa học vào Link để điều hướng đến chi tiết khóa học */}
                <div className="col-lg-4 col-md-6 wow fadeInUp">
                  <Link to={`/courses/${course.id}`} className="text-decoration-none">
                    <div className="classes-item">
                      <div className="bg-light rounded-circle w-75 mx-auto p-3">
                        <img
                          className="img-fluid rounded-circle"
                          src={course.course_image}
                          alt=""
                        />
                      </div>
                      <div className="bg-light rounded p-4 pt-5 mt-n5">
                        <h3 className="text-center mt-3 mb-4">{course.course_name}</h3>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <div className="d-flex align-items-center">
                            <img
                              className="rounded-circle flex-shrink-0"
                              src={`http://127.0.0.1:8000${course.teacher.profile_picture}`}
                              alt=""
                              style={{ width: '45px', height: '45px' }}
                            />
                            <div className="ms-3">
                              <h6 className="text-primary mb-1">{course.teacher.name}</h6>
                              <small>Teacher</small>
                            </div>
                          </div>
                          <span className="bg-primary text-white rounded-pill py-2 px-3">
                            {course.price} VND
                          </span>
                        </div>
                        <div className="row g-1">
                          <div className="col-4">
                            <div className="border-top border-3 border-primary pt-2">
                              <h6 className="text-primary mb-1">Start date:</h6>
                              <small>{course.start_date}</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="border-top border-3 border-success pt-2">
                              <h6 className="text-success mb-1">Time:</h6>
                              <small>{course.time}</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="border-top border-3 border-warning pt-2">
                              <h6 className="text-warning mb-1">Total:</h6>
                              <small>{course.max_students} students</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Classes End */}

      {/* <!-- Appointment Start --> */}
      <div class="container-xxl py-5">
        <div class="container">
          <div class="bg-light rounded">
            <div class="row g-0">
              <div class="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                <div class="h-100 d-flex flex-column justify-content-center p-5">
                  <h1 class="mb-4">Make Appointment</h1>
                  <form>
                    <div class="row g-3">
                      <div class="col-sm-6">
                        <div class="form-floating">
                          <input
                            type="text"
                            class="form-control border-0"
                            id="gname"
                            placeholder="Gurdian Name"
                          />
                          <label for="gname">Gurdian Name</label>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-floating">
                          <input
                            type="email"
                            class="form-control border-0"
                            id="gmail"
                            placeholder="Gurdian Email"
                          />
                          <label for="gmail">Gurdian Email</label>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-floating">
                          <input
                            type="text"
                            class="form-control border-0"
                            id="cname"
                            placeholder="Child Name"
                          />
                          <label for="cname">Child Name</label>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-floating">
                          <input
                            type="text"
                            class="form-control border-0"
                            id="cage"
                            placeholder="Child Age"
                          />
                          <label for="cage">Child Age</label>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-floating">
                          <textarea
                            className="form-control border-0"
                            placeholder="Leave a message here"
                            id="message"
                            style={{ height: '100px' }}
                            value={message}
                            onChange={handleMessageChange}
                          ></textarea>
                          <label for="message">Message</label>
                        </div>
                      </div>
                      <div class="col-12">
                        <button class="btn btn-primary w-100 py-3" type="submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div
                className="col-lg-6 wow fadeIn"
                data-wow-delay="0.5s"
                style={{ minHeight: '400px' }}
              >
                <div class="position-relative h-100">
                  <img
                    className="position-absolute w-100 h-100 rounded"
                    src="img/appointment.jpg"
                    alt="Appointment"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Appointment End --> */}

      {/* Testimonial Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: '600px' }}
          >
            <h1 className="mb-3">Our Clients Say!</h1>
            <p>
              Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero
              ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.
            </p>
          </div>
          <div className="owl-carousel testimonial-carousel wow fadeInUp" data-wow-delay="0.1s">
            <div className="testimonial-item bg-light rounded p-5">
              <p className="fs-5">
                Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor
                amet diam stet. Est stet ea lorem amet est kasd kasd erat eos
              </p>
              <div
                className="d-flex align-items-center bg-white me-n5"
                style={{ borderRadius: '50px 0 0 50px' }}
              >
                <img
                  className="img-fluid flex-shrink-0 rounded-circle"
                  src="img/testimonial-1.jpg"
                  alt="Testimonial"
                  style={{ width: '90px', height: '90px' }}
                />
                <div className="ps-3">
                  <h3 className="mb-1">Client Name</h3>
                  <span>Profession</span>
                </div>
                <i className="fa fa-quote-right fa-3x text-primary ms-auto d-none d-sm-flex"></i>
              </div>
            </div>
            <div className="testimonial-item bg-light rounded p-5">
              <p className="fs-5">
                Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor
                amet diam stet. Est stet ea lorem amet est kasd kasd erat eos
              </p>
              <div
                className="d-flex align-items-center bg-white me-n5"
                style={{ borderRadius: '50px 0 0 50px' }}
              >
                <img
                  className="img-fluid flex-shrink-0 rounded-circle"
                  src="img/testimonial-2.jpg"
                  alt="Testimonial"
                  style={{ width: '90px', height: '90px' }}
                />
                <div className="ps-3">
                  <h3 className="mb-1">Client Name</h3>
                  <span>Profession</span>
                </div>
                <i className="fa fa-quote-right fa-3x text-primary ms-auto d-none d-sm-flex"></i>
              </div>
            </div>
            <div className="testimonial-item bg-light rounded p-5">
              <p className="fs-5">
                Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor
                amet diam stet. Est stet ea lorem amet est kasd kasd erat eos
              </p>
              <div
                className="d-flex align-items-center bg-white me-n5"
                style={{ borderRadius: '50px 0 0 50px' }}
              >
                <img
                  className="img-fluid flex-shrink-0 rounded-circle"
                  src="img/testimonial-3.jpg"
                  alt="Testimonial"
                  style={{ width: '90px', height: '90px' }}
                />
                <div className="ps-3">
                  <h3 className="mb-1">Client Name</h3>
                  <span>Profession</span>
                </div>
                <i className="fa fa-quote-right fa-3x text-primary ms-auto d-none d-sm-flex"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial End */}
    </div>
  );
};

export default Home;
