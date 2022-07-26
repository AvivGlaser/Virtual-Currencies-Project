function getAboutMe() {
  homeElementsVisibility(false);
  drawLoader();
  clearDOMContent();
  getAboutMeContent();
}

function getAboutMeContent(){
  let mainDiv = document.createElement("div");
  let aboutMe = `
    <div class="aboutMe">
     <img src="https://media-exp1.licdn.com/dms/image/C5603AQG0XiNo5Zlj2A/profile-displayphoto-shrink_800_800/0/1639825138741?e=1651104000&v=beta&t=kSsbhqJ41VV8ttU2QuAU-6kV1fyRmEJzoaRQdm_tEIg" alt="..."></img>
       <h1>About Me:</h1>
       <p>Hi, My name is Aviv and I'm 29 years old.</p>
       <p>I am a student for Full Stack Web Development at 'John Bryce' High-Tech academy. </p>
       <p>In this project I've built an application that displays 100 of the most hottest crypto coins with their current values. </p>
       <p>You can check out my latest projects in the links below:</p>
       <footer>
       <a href="https://il.linkedin.com/in/aviv-glaser-226656202?trk=profile-badge" target="_blank" rel="noopener noreferrer" ><img class=socialNetworkIcons src="https://cliply.co/wp-content/uploads/2021/02/372102050_LINKEDIN_ICON_400px.gif" alt"..."></a>
       <a href="https://github.com/AvivGlaser" target="_blank" rel="noopener noreferrer" ><img class=socialNetworkIcons src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="..."></img></a>
       </footer>
    </div>
    `;
  mainDiv.innerHTML = aboutMe;
  DOM.content.append(mainDiv);
}