import {
  createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ======================================================
// SUPABASE
// ======================================================

const SUPABASE_URL =
  "PASTE_YOUR_SUPABASE_URL_HERE";

const SUPABASE_KEY =
  "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";

const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ======================================================
// GLOBAL
// ======================================================

let currentUser = null;
let currentProfile = null;

let selectedRole = "student";


// ======================================================
// HELPERS
// ======================================================

const $ = id =>
  document.getElementById(id);


function notify(message) {

  const box =
    $("notification");

  box.textContent =
    message;

  box.classList.add("show");

  setTimeout(() => {

    box.classList.remove("show");

  }, 4500);

}


function page(name) {

  document
    .querySelectorAll(".page")
    .forEach(p =>
      p.classList.remove("active")
    );

  const target =
    $(name);

  if (target) {

    target.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

  $("nav")?.classList.remove("open");

}


function makeNumber(type) {

  const year =
    new Date().getFullYear();

  const random =
    crypto
      .randomUUID()
      .replaceAll("-", "")
      .substring(0, 8)
      .toUpperCase();

  return `SICN/${type}/${year}/${random}`;
}


function grade(total) {

  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";

  return "F";

}


function remark(g) {

  const remarks = {

    A: "Excellent",
    B: "Very Good",
    C: "Good",
    D: "Pass",
    E: "Weak",
    F: "Fail"

  };

  return remarks[g] || "";

}


function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ======================================================
// MOBILE MENU
// ======================================================

$("menuBtn")?.addEventListener(
  "click",
  () => {

    $("nav")
      .classList
      .toggle("open");

  }
);


// ======================================================
// NAVIGATION
// ======================================================

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-page]"
      );

    if (!button) return;

    page(
      button.dataset.page
    );

  }
);


// ======================================================
// APPLICATION SELECTOR
// ======================================================

document
  .querySelectorAll("[data-form]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".form-box")
          .forEach(box =>
            box.classList.add("hidden")
          );

        const form =
          $(button.dataset.form);

        form?.classList.remove(
          "hidden"
        );

        form?.scrollIntoView({
          behavior: "smooth"
        });

      }
    );

  });


// ======================================================
// STUDENT REGISTER
// ======================================================

$("studentApplicationForm")
  ?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const password =
        $("studentPassword").value;

      const confirm =
        $("studentConfirmPassword").value;

      if (password !== confirm) {

        notify(
          "Student passwords do not match."
        );

        return;
      }


      const email =
        $("studentEmail").value.trim();


      try {

        notify(
          "Creating student account..."
        );


        const {
          data,
          error
        } =
          await supabase.auth.signUp({

            email,

            password,

            options: {

              data: {
                full_name:
                  $("studentName").value.trim(),

                role: "student"
              }

            }

          });


        if (error)
          throw error;


        const user =
          data.user;


        if (!user)
          throw new Error(
            "Unable to create account."
          );


        const registrationNo =
          makeNumber("STU");


        const {
          error: dbError
        } =
          await supabase
            .from(
              "student_applications"
            )
            .insert({

              user_id:
                user.id,

              registration_no:
                registrationNo,

              full_name:
                $("studentName")
                  .value.trim(),

              date_of_birth:
                $("studentDOB").value,

              phone:
                $("studentPhone")
                  .value.trim(),

              email,

              address:
                $("studentAddress")
                  .value.trim(),

              class_name:
                $("studentClass").value,

              parent_name:
                $("parentName")
                  .value.trim(),

              parent_phone:
                $("parentPhone")
                  .value.trim(),

              parent_email:
                $("parentEmail")
                  .value.trim(),

              status: "pending"

            });


        if (dbError)
          throw dbError;


        $("studentApplicationForm")
          .reset();


        notify(
          "Student application submitted. Registration No: " +
          registrationNo
        );


      } catch (error) {

        console.error(error);

        notify(
          error.message ||
          "Student registration failed."
        );

      }

    }
  );


// ======================================================
// STAFF REGISTER
// ======================================================

$("staffApplicationForm")
  ?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const password =
        $("staffPassword").value;

      const confirm =
        $("staffConfirmPassword").value;


      if (password !== confirm) {

        notify(
          "Staff passwords do not match."
        );

        return;
      }


      const email =
        $("staffEmail").value.trim();


      try {

        notify(
          "Creating staff account..."
        );


        const {
          data,
          error
        } =
          await supabase.auth.signUp({

            email,

            password,

            options: {

              data: {

                full_name:
                  $("staffName")
                    .value.trim(),

                role: "staff"

              }

            }

          });


        if (error)
          throw error;


        const user =
          data.user;


        const applicationNo =
          makeNumber("STAFF");


        const {
          error: dbError
        } =
          await supabase
            .from(
              "staff_applications"
            )
            .insert({

              user_id:
                user.id,

              application_no:
                applicationNo,

              full_name:
                $("staffName")
                  .value.trim(),

              address:
                $("staffAddress")
                  .value.trim(),

              qualification:
                $("staffQualification")
                  .value,

              job:
                $("staffJob")
                  .value.trim(),

              phone:
                $("staffPhone")
                  .value.trim(),

              email,

              status:
                "pending"

            });


        if (dbError)
          throw dbError;


        $("staffApplicationForm")
          .reset();


        notify(
          "Staff application submitted. Application No: " +
          applicationNo
        );


      } catch (error) {

        console.error(error);

        notify(
          error.message ||
          "Staff registration failed."
        );

      }

    }
  );


// ======================================================
// MANAGEMENT REGISTER
// ======================================================

$("managementApplicationForm")
  ?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const password =
        $("managementPassword").value;

      const confirm =
        $("managementConfirmPassword").value;


      if (password !== confirm) {

        notify(
          "Management passwords do not match."
        );

        return;
      }


      const email =
        $("managementEmail")
          .value.trim();


      try {

        notify(
          "Creating management account..."
        );


        const {
          data,
          error
        } =
          await supabase.auth.signUp({

            email,

            password,

            options: {

              data: {

                full_name:
                  $("managementName")
                    .value.trim(),

                role:
                  "management"

              }

            }

          });


        if (error)
          throw error;


        const user =
          data.user;


        const applicationNo =
          makeNumber("MGT");


        const {
          error: dbError
        } =
          await supabase
            .from(
              "management_applications"
            )
            .insert({

              user_id:
                user.id,

              application_no:
                applicationNo,

              full_name:
                $("managementName")
                  .value.trim(),

              address:
                $("managementAddress")
                  .value.trim(),

              qualification:
                $("managementQualification")
                  .value.trim(),

              job:
                $("managementJob")
                  .value.trim(),

              phone:
                $("managementPhone")
                  .value.trim(),

              email,

              status:
                "pending"

            });


        if (dbError)
          throw dbError;


        $("managementApplicationForm")
          .reset();


        notify(
          "Management application submitted. Application No: " +
          applicationNo
        );


      } catch (error) {

        console.error(error);

        notify(
          error.message ||
          "Management registration failed."
        );

      }

    }
  );


// ======================================================
// DIRECTOR REGISTER
// ======================================================

$("directorApplicationForm")
  ?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const password =
        $("directorPassword").value;

      const confirm =
        $("directorConfirmPassword").value;


      if (password !== confirm) {

        notify(
          "Director passwords do not match."
        );

        return;
      }


      if (password.length < 8) {

        notify(
          "Director password must be at least 8 characters."
        );

        return;
      }


      const email =
        $("directorEmail")
          .value.trim();


      try {

        notify(
          "Creating Director account..."
        );


        const {
          data,
          error
        } =
          await supabase.auth.signUp({

            email,

            password,

            options: {

              data: {

                full_name:
                  $("directorName")
                    .value.trim(),

                role:
                  "director"

              }

            }

          });


        if (error)
          throw error;


        const user =
          data.user;


        if (!user)
          throw new Error(
            "Unable to create Director account."
          );


        const directorNo =
          makeNumber("DIR");


        const {
          error: dbError
        } =
          await supabase
            .from(
              "director_applications"
            )
            .insert({

              user_id:
                user.id,

              director_no:
                directorNo,

              full_name:
                $("directorName")
                  .value.trim(),

              address:
                $("directorAddress")
                  .value.trim(),

              qualification:
                $("directorQualification")
                  .value.trim(),

              job:
                $("directorJob")
                  .value.trim(),

              phone:
                $("directorPhone")
                  .value.trim(),

              email,

              status:
                "pending"

            });


        if (dbError)
          throw dbError;


        $("directorApplicationForm")
          .reset();


        notify(
          "Director registration submitted. Director No: " +
          directorNo
        );


      } catch (error) {

        console.error(error);

        notify(
          error.message ||
          "Director registration failed."
        );

      }

    }
  );


// ======================================================
// LOGIN ROLE
// ======================================================

document
  .querySelectorAll(
    ".login-types button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".login-types button"
          )
          .forEach(btn =>
            btn.classList.remove(
              "selected"
            )
          );

        button.classList.add(
          "selected"
        );

        selectedRole =
          button.dataset.role;

      }
    );

  });


// ======================================================
// LOGIN
// ======================================================

$("loginForm")
  ?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const number =
        $("loginNumber")
          .value.trim();

      const email =
        $("loginEmail")
          .value.trim();

      const password =
        $("loginPassword").value;


      try {

        $("loginMessage")
          .textContent =
          "Checking account...";


        const {
          data,
          error
        } =
          await supabase.auth
            .signInWithPassword({

              email,
              password

            });


        if (error)
          throw error;


        currentUser =
          data.user;


        const profile =
          await findApprovedProfile(
            currentUser.id,
            selectedRole,
            number
          );


        if (!profile) {

          await supabase.auth
            .signOut();

          throw new Error(
            "Account not found, or account has not been approved."
          );

        }


        currentProfile =
          profile;


        openDashboard(
          selectedRole,
          profile
        );


        $("loginForm").reset();

        $("loginMessage")
          .textContent = "";


      } catch (error) {

        console.error(error);

        $("loginMessage")
          .textContent =
          error.message ||
          "Login failed.";

      }

    }
  );


// ======================================================
// FIND APPROVED PROFILE
// ======================================================

async function findApprovedProfile(
  userId,
  role,
  number
) {

  let table;
  let column;


  if (role === "student") {

    table =
      "student_applications";

    column =
      "registration_no";

  }


  else if (role === "staff") {

    table =
      "staff_applications";

    column =
      "application_no";

  }


  else if (role === "management") {

    table =
      "management_applications";

    column =
      "application_no";

  }


  else {

    table =
      "director_applications";

    column =
      "director_no";

  }


  const {
    data,
    error
  } =
    await supabase
      .from(table)
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .eq(
        column,
        number
      )
      .eq(
        "status",
        "approved"
      )
      .maybeSingle();


  if (error) {

    console.error(error);

    return null;

  }


  return data;

}


// ======================================================
// OPEN DASHBOARD
// ======================================================

function openDashboard(
  role,
  profile
) {

  page("dashboard");


  $("dashboardName")
    .textContent =
    profile.full_name ||
    "User";


  $("dashboardNumber")
    .textContent =
    profile.registration_no ||
    profile.application_no ||
    profile.director_no ||
    "";


  $("dashboardRole")
    .textContent =
    role.toUpperCase();


  $("studentDashboard")
    .classList.add("hidden");

  $("staffDashboard")
    .classList.add("hidden");

  $("managementDashboard")
    .classList.add("hidden");

  $("directorDashboard")
    .classList.add("hidden");


  if (role === "student") {

    $("studentDashboard")
      .classList.remove("hidden");

  }


  if (role === "staff") {

    $("staffDashboard")
      .classList.remove("hidden");

  }


  if (role === "management") {

    $("managementDashboard")
      .classList.remove("hidden");

  }


  if (role === "director") {

    $("directorDashboard")
      .classList.remove("hidden");

  }

}


// ======================================================
// STUDENT RESULTS
// ======================================================

$("viewStudentResults")
  ?.addEventListener(
    "click",
    async () => {

      $("studentResultsBox")
        .classList
        .remove("hidden");


      const {
        data,
        error
      } =
        await supabase
          .from("results")
          .select("*")
          .eq(
            "student_id",
            currentUser.id
          )
          .eq(
            "status",
            "approved"
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );


      if (error) {

        $("studentResults")
          .innerHTML =
          "<p>Unable to load results.</p>";

        return;

      }


      if (!data?.length) {

        $("studentResults")
          .innerHTML =
          "<p>No approved results available.</p>";

        return;

      }


      $("studentResults")
        .innerHTML =
        makeResultsTable(data);

    }
  );


// ======================================================
// RESULT TABLE
// ======================================================

function makeResultsTable(
  results
) {

  let html = `

    <table>

      <thead>

        <tr>

          <th>Subject</th>
          <th>Class</th>
          <th>Session</th>
          <th>Term</th>
          <th>CA</th>
          <th>Exam</th>
          <th>Total</th>
          <th>Grade</th>
          <th>Remark</th>

        </tr>

      </thead>

      <tbody>

  `;


  results.forEach(result => {

    html += `

      <tr>

        <td>
          ${escapeHTML(result.subject)}
        </td>

        <td>
          ${escapeHTML(result.class_name)}
        </td>

        <td>
          ${escapeHTML(result.session)}
        </td>

        <td>
          ${escapeHTML(result.term)}
        </td>

        <td>${result.ca}</td>

        <td>${result.exam}</td>

        <td>${result.total}</td>

        <td>${result.grade}</td>

        <td>
          ${escapeHTML(result.remark)}
        </td>

      </tr>

    `;

  });


  html += `
      </tbody>
    </table>
  `;


  return html;

}


// ======================================================
// STAFF RESULT ENTRY
// ======================================================

$("showResultEntry")
  ?.addEventListener(
    "click",
    () => {

      $("resultEntryBox")
        .classList
        .toggle("hidden");

    }
  );


$("resultForm")
  ?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const ca =
        Number(
          $("resultCA").value
        );

      const exam =
        Number(
          $("resultExam").value
        );


      const total =
        ca + exam;


      const g =
        grade(total);


      try {

        const {
          error
        } =
          await supabase
            .from("results")
            .insert({

              student_id:
                $("resultStudentId")
                  .value.trim(),

              student_reg_no:
                $("resultRegNo")
                  .value.trim(),

              class_name:
                $("resultClass")
                  .value.trim(),

              subject:
                $("resultSubject")
                  .value.trim(),

              session:
                $("resultSession")
                  .value.trim(),

              term:
                $("resultTerm").value,

              ca,

              exam,

              total,

              grade: g,

              remark:
                remark(g),

              status:
                "pending",

              entered_by:
                currentUser.id

            });


        if (error)
          throw error;


        $("resultForm").reset();


        notify(
          "Result submitted for Management approval."
        );


      } catch (error) {

        console.error(error);

        notify(
          error.message ||
          "Result submission failed."
        );

      }

    }
  );


// ======================================================
// LOAD APPLICATIONS
// ======================================================

async function loadApplications(
  table,
  target
) {

  const {
    data,
    error
  } =
    await supabase
      .from(table)
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    $(target).innerHTML =
      `<p>${escapeHTML(error.message)}</p>`;

    return;

  }


  if (!data?.length) {

    $(target).innerHTML =
      "<p>No records found.</p>";

    return;

  }


  $(target).innerHTML =
    makeApplicationTable(
      data,
      table
    );

}


// ======================================================
// APPLICATION TABLE
// ======================================================

function makeApplicationTable(
  data,
  table
) {

  let html = `

    <table>

      <thead>

        <tr>

          <th>Name</th>
          <th>Number</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Status</th>
          <th>Action</th>

        </tr>

      </thead>

      <tbody>

  `;


  data.forEach(item => {

    const number =
      item.registration_no ||
      item.application_no ||
      item.director_no ||
      "";


    html += `

      <tr>

        <td>
          ${escapeHTML(item.full_name)}
        </td>

        <td>
          ${escapeHTML(number)}
        </td>

        <td>
          ${escapeHTML(item.phone)}
        </td>

        <td>
          ${escapeHTML(item.email)}
        </td>

        <td>

          <span class="status ${item.status}">
            ${escapeHTML(item.status)}
          </span>

        </td>

        <td>

          ${
            item.status === "pending"
              ?

          `
            <button
              class="btn primary approve-btn"
              data-id="${item.id}"
              data-table="${table}">

              Approve

            </button>

            <button
              class="btn danger reject-btn"
              data-id="${item.id}"
              data-table="${table}">

              Reject

            </button>
          `

              :

          "-"

          }

        </td>

      </tr>

    `;

  });


  html += `

      </tbody>

    </table>

  `;


  return html;

}


// ======================================================
// MANAGEMENT BUTTONS
// ======================================================

$("managementStudents")
  ?.addEventListener(
    "click",
    () =>
      loadApplications(
        "student_applications",
        "managementData"
      )
  );


$("managementStaff")
  ?.addEventListener(
    "click",
    () =>
      loadApplications(
        "staff_applications",
        "managementData"
      )
  );


$("managementApplications")
  ?.addEventListener(
    "click",
    () => {

      $("managementData")
        .innerHTML = `
          <h3>Applications</h3>
          <p>
            Select Students or Staff to
            view their applications.
          </p>
        `;

    }
  );


// ======================================================
// DIRECTOR BUTTONS
// ======================================================

$("directorStudents")
  ?.addEventListener(
    "click",
    () =>
      loadApplications(
        "student_applications",
        "directorData"
      )
  );


$("directorStaff")
  ?.addEventListener(
    "click",
    () =>
      loadApplications(
        "staff_applications",
        "directorData"
      )
  );


$("directorManagement")
  ?.addEventListener(
    "click",
    () =>
      loadApplications(
        "management_applications",
        "directorData"
      )
  );


$("directorApplications")
  ?.addEventListener(
    "click",
    async () => {

      await loadApplications(
        "student_applications",
        "directorData"
      );

    }
  );


$("directorResults")
  ?.addEventListener(
    "click",
    async () => {

      const {
        data,
        error
      } =
        await supabase
          .from("results")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false
            }
          );


      if (error) {

        $("directorData")
          .innerHTML =
          `<p>${escapeHTML(error.message)}</p>`;

        return;

      }


      $("directorData")
        .innerHTML =
        makeResultsTable(data || []);

    }
  );


$("directorReports")
  ?.addEventListener(
    "click",
    () => {

      $("directorData")
        .innerHTML = `

          <h3>Director Reports</h3>

          <p>
            Reports module will use the
            student, staff, application and
            result data from Supabase.
          </p>

        `;

    }
  );


// ======================================================
// APPROVE / REJECT
// ======================================================

document.addEventListener(
  "click",
  async event => {

    const approve =
      event.target.closest(
        ".approve-btn"
      );

    const reject =
      event.target.closest(
        ".reject-btn"
      );


    if (!approve && !reject)
      return;


    const button =
      approve || reject;


    const id =
      button.dataset.id;


    const table =
      button.dataset.table;


    const status =
      approve
        ? "approved"
        : "rejected";


    try {

      const {
        error
      } =
        await supabase
          .from(table)
          .update({
            status
          })
          .eq(
            "id",
            id
          );


      if (error)
        throw error;


      notify(
        `Application ${status}.`
      );


      if (
        selectedRole === "director"
      ) {

        loadApplications(
          table,
          "directorData"
        );

      } else {

        loadApplications(
          table,
          "managementData"
        );

      }


    } catch (error) {

      console.error(error);

      notify(
        error.message ||
        "Unable to update application."
      );

    }

  }
);


// ======================================================
// LOGOUT
// ======================================================

$("logoutBtn")
  ?.addEventListener(
    "click",
    async () => {

      await supabase.auth.signOut();

      currentUser = null;

      currentProfile = null;

      $("studentDashboard")
        .classList.add("hidden");

      $("staffDashboard")
        .classList.add("hidden");

      $("managementDashboard")
        .classList.add("hidden");

      $("directorDashboard")
        .classList.add("hidden");

      page("home");

      notify(
        "You have logged out."
      );

    }
  );


// ======================================================
// SESSION
// ======================================================

async function checkSession() {

  const {
    data
  } =
    await supabase.auth
      .getSession();


  if (data.session) {

    currentUser =
      data.session.user;

  }

}


// ======================================================
// START
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    checkSession();

    document
      .querySelector(
        '.login-types [data-role="student"]'
      )
      ?.classList.add("selected");

  }
);
