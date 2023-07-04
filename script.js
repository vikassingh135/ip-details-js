const getData = () => {
  let ipAddress;

  $.getJSON("https://api.ipify.org?format=json", function (data) {
    ipAddress = data.ip;
    document.getElementById(
      "ip-address"
    ).innerText = `My Public IP Address : ${ipAddress}`;

    displayGeoDetails(data.ip);
  });

  document.getElementById("get-data-btn").remove();
};

const displayGeoDetails = async (ipAddress) => {
  try {
    //   const geoDataString = await fetch(`https://ipinfo.io/${ipAddress}/geo?token=42c1873d8559c0`);
    //   const geoData = await geoDataString.json();
  } catch (err) {}
  const geoData = {
    ip: "106.77.129.214",
    city: "Dehra Dūn",
    region: "Uttarakhand",
    country: "IN",
    loc: "30.3244,78.0339",
    org: "AS45271 Idea Cellular Limited",
    postal: "248001",
    timezone: "Asia/Kolkata",
  };

  const lat = geoData.loc.split(",")[0];
  const long = geoData.loc.split(",")[1];
  console.log(geoData);
  document.getElementById("lat").innerText = `Lat : ${lat}`;
  document.getElementById("long").innerText = `Long : ${long}`;
  document.getElementById("city").innerText = `City : ${geoData.city}`;
  document.getElementById("region").innerText = `Region : ${geoData.region}`;
  document.getElementById(
    "organisation"
  ).innerText = `Organisation: ${geoData.org}`;

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

  const pincodes = await fetch(
    `https://api.postalpincode.in/pincode/${postal}`
  );

  const pincodesData = await pincodes.json();

  document.getElementById("message").innerHTML = `
        <b>Message:</b> ${pincodesData[0].Message}
    `;
  console.log(pincodesData);

  displayPinDetails(pincodesData[0].PostOffice);
};

const displayPinDetails = (pincodes) => {
  const pincodeDetails = document.getElementById("pincode-details");

  pincodeDetails.innerHTML = "";

  pincodes.forEach((pinDetails) => {
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
