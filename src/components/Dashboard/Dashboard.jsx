import React from "react";

const Dashboard = () => {
  return (
    <div className="app-wrapper">
      {/* Header */}

      {/* Sidebar */}
      <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
  <div className="sidebar-wrapper">
    <nav className="mt-2">
      {/* begin::Sidebar Menu */}
      <ul
        className="nav sidebar-menu flex-column"
        data-lte-toggle="treeview"
        role="menu"
        data-accordion="false"
      >
        <li className="nav-item menu-open">
          <a href="#" className="nav-link active">
            <i className="nav-icon bi bi-speedometer"></i>
            <p>
              Dashboard
              <i className="nav-arrow bi bi-chevron-right"></i>
            </p>
          </a>
          <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-circle"></i>
                <p>Booking Status</p>
              </a>
            </li>

          <ul className="nav nav-treeview">
            <li className="nav-item">
              <a href="./index.html" className="nav-link active">
                <i className="nav-icon bi bi-circle"></i>
                <p>User Profile</p>
              </a>
            </li>

            <li className="nav-item">
              <a href="./index2.html" className="nav-link">
                <i className="nav-icon bi bi-circle"></i>
                <p>Review And Rewards</p>
              </a>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-circle"></i>
                <p>Membership Pint</p>
              </a>
            </li>
          </ul>
        </li>
      </ul>
      {/* end::Sidebar Menu */}
    </nav>
  </div>
</aside>

      {/* Main */}
      <main className="app-main">
        <div className="app-content-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6"><h3 className="mb-0">Dashboard</h3></div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-end">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="app-content">
          <div className="container-fluid">
            <div className="row">

              {/* Box */}
              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-primary">
                  <div className="inner">
                    <h3>1</h3>
                    <p>Booking Records</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>2</h3>
                    <p>Review & Rewards</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-warning">
                  <div className="inner">
                    <h3>44</h3>
                    <p>Membership Point</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-danger">
                  <div className="inner">
                    <h3>65</h3>
                    <p>Unique Visitors</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;