function getLiveReports() {
  homeElementsVisibility(false);
  drawLoader();
  clearDOMContent();
  getLiveReportsContent();
}

function getLiveReportsContent(){
  let mainDiv = document.createElement("div");
  let comingSoon = `
  <div class=liveReports>
    <img src="https://media.istockphoto.com/vectors/geometric-banner-megaphone-with-coming-soon-bubble-loudspeaker-modern-vector-id1181378326?k=20&m=1181378326&s=612x612&w=0&h=FUstjwTm6ZOYSHkusiHSsPHUV7kSGDnmRF18QDy-AO8=" alt="..."></img>
  </div>`;
  mainDiv.innerHTML = comingSoon;
  DOM.content.append(mainDiv);
}
