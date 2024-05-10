import React, { useState, useEffect } from 'react';
import Login from './login.js';
import './certificate.css'

function Certificate() {
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  },[token]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/data', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    
   
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = (token) => {
    setToken(token);
  };
  return (
  
	<div className="certificate-wrapper">
		<div className="certificate-background" >
			<div className="boxright"></div>
			<div className="boxleft"></div>
			<div className="box1"></div>
			<div className="box2"></div>
			<div className="box3"></div>
			<div className="box4"></div>
			<div className="box5"></div>
			<div className="box6"></div>
			<div className="box7"></div>
			<div className="box8"></div>
			<div className="border1"></div>
			<div className="border2"></div>
			<div className="border3"></div>
			<div className="border4"></div>
			<div className="border5"></div>
			<div className="border6"></div>
			<div className="border7"></div>
			<div className="border8"></div>
		</div>
		
		{token ? (
        
        data && (
         <div>
            {data.map((item, index) => (
        <div key={index}>
		
		<div className="certificate-content">
			<div className="title">{item.title}</div>
			<div className="sr-no">Certificate Number: {item.srNo}</div>
			<div className="date">Date: {item.date}</div>

			<div className="subtitle"><b>{item.subtitle}</b></div>
			<div className="certificate-logo">
				<img src={item.logo}alt='logo'/>
			</div>

			<div className="initial-content">{item.initialContent}</div>
			<div className="candidate-name">{item.candidateName}</div>
			<div className="main-content">{item.mainContent1}<br/> {item.mainContent2}</div>

			<img className="sign-president-img" src={item.president} alt='sign'/>
			<div className="sign-president">{item.signPresident}</div>

			<img className="sign-director-img" src={item.director} alt='sign'/>
			<div className="sign-director">{item.signDirector}</div>

			<div className="org-logo">
				<img src={item.orgLogo} alt='logo'/>
			</div>

			<div className="org-name">{item.orgName}</div>
			<div className="org-address">
				<p>{item.orgAddress1}</p>
				<p>{item.orgAddress2}</p>
			</div>
		</div>
		</div>
            ))}
		</div>
        )
      ) : (
        <div className='login'>
        <Login onLogin={handleLogin} />
        </div>
	  )}

    </div>
	
  )
  
}

export default Certificate;


	