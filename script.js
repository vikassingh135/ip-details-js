let postOffices = [];

let theme = "light";

const getData = () => {
  let ipAddress;

  $.getJSON("https://api.ipify.org?format=json")
    .done(function (data) {
      ipAddress = data.ip;
      document.getElementById(
        "ip-address"
      ).innerText = `My Public IP Address: ${ipAddress}`;
      displayGeoDetails(data.ip);
    })
    .fail(function (jqXHR, textStatus, error) {
      console.log("Request failed:", error);
      document.getElementsByClassName("geolocation-details")[0].innerHTML = `
      <span class="error">
        Server Error!! IP Address Details Could not found;
      </span>
    `;
      return;
    });

  // $.getJSON("https://api.ipify.org?format=json", function (data) {
  //   ipAddress = data.ip;
  //   document.getElementById(
  //     "ip-address"
  //   ).innerText = `My Public IP Address : ${ipAddress}`;
  //   displayGeoDetails(data.ip);
  // });

  document.getElementById("get-data-btn").style.display = "none";
};

const displayGeoDetails = async (ipAddress) => {
  
  let geoDataString, geoData;
  
  try {
     geoDataString = await fetch(`https://ipinfo.io/${ipAddress}/geo?token=42c1873d8559c0`);
     geoData = await geoDataString.json();
   } catch (err) {
    document.getElementsByClassName("geolocation-details")[0].innerHTML = `
      <span class="error">
        Server Error!! Geolocation Details Could not found;
      </span>
    `;
    return;
  }
  //  geoData = {
  //   ip: "106.77.129.214",
  //   city: "Dehra Dūn",
  //   region: "Uttarakhand",
  //   country: "IN",
  //   loc: "30.3244,78.0339",
  //   org: "AS45271 Idea Cellular Limited",
  //   postal: "248001",
  //   timezone: "Asia/Kolkata",
  // };

  const lat = geoData.loc.split(",")[0];
  const long = geoData.loc.split(",")[1];
  console.log(geoData);
  document.getElementById("lat").innerHTML = `<b>Lat</b> : ${lat}`;
  document.getElementById("long").innerHTML = `<b>Long</b> : ${long}`;
  document.getElementById("city").innerHTML = `<b>City</b> : ${geoData.city}`;
  document.getElementById("region").innerHTML = `<b>Region</b> : ${geoData.region}`;
  document.getElementById("hostname").innerHTML = `<b>Hostname</b> : ${location.hostname}`;
  document.getElementById(
    "organisation"
  ).innerHTML = `<b>Organisation:</b> ${geoData.org}`;

  displayMap(lat, long);
  displayTimeZone(geoData.timezone);
  displayPinCode(geoData.postal);
};

const displayMap = (lat, long) => {
  document.getElementById("map").innerHTML = `
    <iframe
    src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed"
    width="100%"
    height="400"
    frameborder="0"
    style="border: 0"
  ></iframe>
    `;
};

const displayTimeZone = (timeZone) => {
  let datetime = new Date().toLocaleString("en-US", {
    timeZone,
  });

  document.getElementById("timezone").innerHTML = `
    <b>Time Zone:</b> ${timeZone}
  `;

  document.getElementById("date-time").innerHTML = `
    <b>Date And Time:</b> ${datetime}
  `;
};

const displayPinCode = async (postal) => {
  document.getElementById("pincode").innerHTML = `
        <b>Pincode:</b> ${postal}
    `;

  let pincodes, pincodesData;

  try {
    pincodes = await fetch(`https://api.postalpincode.in/pincode/${postal}`);
    pincodesData = await pincodes.json();
  } catch (error) {
    console.log(err);
    document.getElementById("pincode-details").innerHTML = `
      <spanclass="error">
        Server Error!! Postal Details Could not found;
      </span>
    `;
    return;
  }

  if (pincodesData[0].Status !== "Success") {
    document.getElementById("pincode-details").innerHTML = `
      <span class="error">
        Server Error!! Postal Details Could not found;
      </span>
    `;
    return;
  }

  document.getElementById("search-box").style.display = "flex";

  document.getElementById("message").innerHTML = `
        <b>Message:</b> ${pincodesData[0].Message}
    `;
  console.log(pincodesData);
  postOffices = pincodesData[0].PostOffice;
  displayPinDetails();
};

const displayPinDetails = () => {
  const pincodeDetails = document.getElementById("pincode-details");

  pincodeDetails.innerHTML = "";

  let searchValue = document.getElementById("search-pin").value;

  console.log(searchValue);

  postOffices.forEach((pinDetails) => {
    // filtering based on postal name
    if (
      searchValue.length > 0 &&
      !pinDetails.Name.toLowerCase().includes(searchValue.toLowerCase()) &&
      !pinDetails.BranchType.toLowerCase().includes(searchValue.toLowerCase())
    )
      return;

    pincodeDetails.innerHTML += `
    <div class="pincode-div">
      <div><b>Name:</b> ${pinDetails.Name}</div>
      <div><b>Branch Type:</b> ${pinDetails.BranchType}</div>
      <div><b>Delivery Status:</b> ${pinDetails.DeliveryStatus}</div>
      <div><b>District:</b> ${pinDetails.District}</div>
      <div><b>Division:</b> ${pinDetails.Division}</div>
    </div>
  `;
  });
};

document
  .getElementById("search-pin")
  .addEventListener("keyup", displayPinDetails);

document.getElementById("theme").addEventListener("click", () => {
  console.log("clicked");
  if (theme === "light") {
    theme = "dark";
    displayDark();
  } else {
    theme = "light";
    displayLight();
  }
});

const displayDark = () => {
  document.getElementsByTagName("body")[0].className = "body-dark";
  document.getElementById("theme").innerHTML = `
  <span class="material-symbols-outlined" id="light-mode">
    light_mode
  </span>
  `;
  document.getElementById("get-data-btn").className = "get-data-btn-dark";
  document.getElementById("pincode-details").className = "pincode-details-dark";
  document.getElementById("search-box").className = "search-box-dark";
  document.querySelector("#search-pin").style.setProperty("--c", "white");
};

const displayLight = () => {
  document.getElementsByTagName("body")[0].className = "body-light";
  document.getElementById("theme").innerHTML = `
  <span class="material-symbols-outlined" id="dark-mode">
  dark_mode </span
>
  `;
  document.getElementById("get-data-btn").className = "get-data-btn-light";
  document.getElementById("pincode-details").className =
    "pincode-details-light";
  document.getElementById("search-box").className = "search-box-light";
  document.querySelector("#search-pin").style.setProperty("--c", "black");
};
