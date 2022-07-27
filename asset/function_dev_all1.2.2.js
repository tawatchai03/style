	// function parameter
	// TODO: CDN
	window.cmBaseApiUrl = 'https://api-gw-py-prod.lavagaming.com'
	window.spinixBaseApiUrl = 'https://backend.spinix.com'
	window.spinixLobbyUrl = 'https://www.spinix.com'
	console.log('platform function v.1.2.4 build 07-03-2022')

	let ReconnectCount = 1;

	var getUrlParameter = function getUrlParameter(sParam) {
	    var sPageURL = window.location.search.substring(1),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
	        }
	    }
	};

	var getRandomString = function getRandomString(length) {
	    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    var result = '';
	    for (var i = 0; i < length; i++) {
	        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
	    }
	    return result;
	}

	//--- logout spinix

	if ((getUrlParameter('logout') == "true")) {
	    localStorage.removeItem('credential');
	    console.log('logout mode -> ' + getUrlParameter('logout'));
	} else {
	    //Nothing todo
	}

	if ((getUrlParameter('autologon') == "true")) {
	    if ((localStorage.getItem("credential") != null)) {
	        tokenKey = localStorage.getItem("credential");
	        lobbyURL = window.spinixLobbyUrl + '/?token=' + tokenKey;
	        window.location.assign(lobbyURL);
	    } else {
	        window.location.assign('/');
	    }

	} else {

	}



	function BindReg(ElementArr, RegURL) {
	    for (j = 0; j < ElementArr.length; j++) {
	        //Check Element Exist first
	        var element = document.getElementById(ElementArr[j]);
	        if (typeof(element) != 'undefined' && element != null) {
	            // Exists.
	            document.getElementById(ElementArr[j]).addEventListener("click", function() {
	                window.location.assign(RegURL);
	            });
	            console.log("El: #" + ElementArr[j] + " Binding done.");
	        } else {
	            //Not Exist
	            console.log('ERROR: #' + ElementArr[j] + ' EL NOT EXIST.');
	        }
	    }
	}

	/*function demo game*/
	//function BuildDemoGameElement(parent_style, childstyle, childimgstyle, mediaquery) {
	function BuildDemoGameElement() {
	    if (typeof window.siteagentId !== "undefined") {
	        //console.log('Site coniguration loaded');
	        //console.log('Demo Mode: ',Demo_mode[0])
	        //console.log('test obj: ', StyleSettings.parentdiv)
	        var header = new Headers();
	        header.append("Content-Type", "application/json");
	        var siteAgentId = window.siteagentId;
	        var brandURL = window.location.href;
	        var raw = JSON.stringify({
	            "agents_id": siteAgentId,
	            "order": "description"
	        });

	        var requestOptions = {
	            method: 'POST',
	            headers: header,
	            body: raw,
	            redirect: 'follow'
	        };

	        // à¸à¸£à¸“à¸µà¸¡à¸µà¸£à¸¹à¸›à¸¡à¸²à¹€à¸­à¸‡à¹à¸•à¹ˆà¹„à¸¡à¹ˆà¸£à¸±à¸šà¸›à¸£à¸°à¸à¸±à¸™à¸§à¹ˆà¸²à¸ˆà¸°à¸¡à¸µà¸„à¸£à¸šà¸—à¸¸à¸à¸£à¸¹à¸›
	        // var imageUrl = '';
	        var providerList = document.querySelector('#app');
	        providerList.classList.remove("ct-div-block");
	        providerList.classList.add("providerList", "providerFlex");
	        var providerFlex = document.querySelector('.providerFlex');
	        providerFlex.setAttribute("style", StyleSettings.parentdiv);
	        var partnerItemStyle = StyleSettings.childsimg;
	        // style css à¸à¸£à¸“à¸µà¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸›à¸£à¸±à¸šà¹€à¸£à¸·à¹ˆà¸­à¸‡à¸‚à¸­à¸‡ à¸à¸²à¸£à¹à¸ªà¸”à¸‡à¸œà¸¥à¹€à¸­à¸‡
	        var style = document.createElement('style');
	        style.innerHTML = StyleSettings.responsive;
	        document.head.appendChild(style);
	        fetch(window.cmBaseApiUrl + "/get-games", requestOptions)
	            .then((response) => {
	                return response.json();
	            })
	            .then(function(data) {
	                let partners = data.data.list;
	                partners = partners.filter((x) => x.partner === "xg")
	                    //partners = partners.filter((x) => x.demo === "true")

	                //console.log(partners)

	                return partners.map(function(partner) {
	                    let partnerItem = document.createElement('div');
	                    partnerItem.classList.add(StyleSettings.childsdiv);
	                    partnerItem.setAttribute("style", StyleSettings.childsimg);

	                    let partnerImg = document.createElement('img');
	                    partnerImg.classList.add('partnerImg');
	                    let _imgURL = '';
	                    if (Demo_mode[0] == 'default') {
	                        _imgURL = partner.image;
	                    }
	                    if (Demo_mode[0] == 'mycover') {
	                        _imgURL = Demo_mode[1] + '' + partner.gameId + '.' + Demo_mode[2]
	                    }

	                    partnerImg.src = _imgURL

	                    partnerImg.alt = `${partner.description} (${partner.partner.toLocaleUpperCase()})`;
	                    partnerImg.onclick = function() {
	                        Startgame(partner.partner, partner.gameId, brandURL)
	                    }

	                    partnerItem.append(partnerImg);
	                    providerList.append(partnerItem);
	                })
	            })
	            .catch(error => console.log('error', error));

	    } else {
	        setTimeout(BuildDemoGameElement, 250);
	        //console.log('Site coniguration not ready yet, reconnecting...[',ReconnectCount,']')
	        ReconnectCount++;
	    }
	}
	//end dom load & element timing

	function Startgame(Partner, GameID, BrandReturnURL) {
	    /*
	     * function à¹€à¸£à¸´à¹ˆà¸¡à¹€à¸à¸¡
	     * à¸£à¸±à¸š id à¸‚à¸­à¸‡à¹€à¸à¸¡à¸¡à¸²à¹ƒà¸ªà¹ˆ header à¹à¸¥à¹‰à¸§à¸”à¸¶à¸‡ url à¸­à¸­à¸à¸¡à¸²
	     * à¸–à¸±à¸”à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¸„à¹ˆà¸­à¸¢ redirect à¹„à¸›à¸¢à¸±à¸‡à¹€à¸à¸¡
	     */
	    var GameURLHeader = new Headers();
	    GameURLHeader.append("Content-Type", "application/json");

	    var GameURLRaw = JSON.stringify({
	        "partner": Partner,
	        "game": GameID,
	        "isMobile": true,
	        "returnURL": BrandReturnURL
	    });

	    var GameURLrequestOptions = {
	        method: 'POST',
	        headers: GameURLHeader,
	        body: GameURLRaw,
	        redirect: 'follow'
	    };
	    fetch(window.cmBaseApiUrl + "/launchgame-demo", GameURLrequestOptions)
	        .then((response) => {
	            return response.json();
	        })
	        .then(function(data) {
	            // console.log(data.data.url)
	            window.location.assign(data.data.url)
	        })
	        .catch(error => console.log('error', error));

	} //EOF Startgame


	/**--------------------------------------------------------------------- */
	document.addEventListener('DOMContentLoaded', function() {

	    //document loadded done start
	    //step 1: initial site config
	    console.log('site config header.');
	    var Sitebrand_id = window.sitebrandId
	        //var Sitebrand_register_id = "00X00";
	    async function initialSiteConfig() {
	        var requestOptions = {
	            method: 'GET',
	            redirect: 'follow'
	        };
	        const response = await fetch(window.cmBaseApiUrl + "/brands-setting/" + Sitebrand_id, requestOptions);
	        const _siteconfig = await response.json();
	        return _siteconfig;
	    }
	    //step 2: 
	    initialSiteConfig().then(_siteconfig => {
	        _siteconfig; // fetched config
	        action = _siteconfig.setting.setting_items_register;
	        const Sitebrand_register_id = GetBrandRegisterID();
	        window.siteagentId = Sitebrand_register_id
	        var ServerURL = window.spinixLobbyUrl + '/';
	        var iFrameBackgroundColor = window.iFrameBackgroundColor
	        var SiteRegisterReferral = localStorage.getItem('referral');
	        var currentkey = BuildKey();
	        var SpinixDiamondURL = BuildSpinixDiamondLink(ServerURL);
	        var SpinixRegisterURL = BuildSpinixRegisterLink(ServerURL)
	        var SiteLINEOfficial = BuildLINEOfficialLink(_siteconfig.setting.line_id);
	        var SiteFACEBOOKOfficial = BuildFACEBOOKOfficialLink(_siteconfig.setting.facebookURL);

	        //var SetLoginElementLink = window.btnLoginIds;
	        var SetRegisElementLink = window.registerIds;

	        //LINE OFFICIAL
	        var SetLINEOfficialLink = window.lineofficial;

	        //FACEBOOK OFFICIAL
	        var SetFACEBOOKOfficialLink = window.facebookofficial;


	        window.spinixIFrameUrlSource = SpinixDiamondURL
	        window.spinixRegisterURLSource = SpinixRegisterURL

	        var element = document.getElementById('advanced_iframe');
	        if (typeof(element) != 'undefined' && element != null) {
	            // your code here
	            console.log('Found advance iframe !');

	            var loc = window.spinixIFrameUrlSource;
	            document.getElementById('advanced_iframe').setAttribute('src', loc);

	            console.log('advance iframe bind done!')

	        } else {
	            console.log('have a good day')
	                // finish code test
	        } //element exist check

	        function GetBrandRegisterID() {
	            let _registerid = '00X00';
	            //let _registerid = _siteconfig.setting.setting_items_register;

	            const settingItemId = _siteconfig.setting.setting_items_register;
	            const agentObj = _siteconfig.setting_items.find((v) => v._id === settingItemId);
	            const agentId = agentObj.agent_register;
	            _registerid = agentId;
	            return _registerid;
	        }

	        function BuildLINEOfficialLink(_lineofficialid) {
	            if (_lineofficialid == null) {
	                //console.log('à¸à¸£à¸¸à¸“à¸²à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸² LINE Official à¹ƒà¸™à¸£à¸°à¸šà¸š Central Management');
	                _lineofficialid = '/';
	            } else {
	                _lineofficialid = 'https://line.me/ti/p/~' + _lineofficialid;
	            }

	            return _lineofficialid;
	        }

	        function BuildFACEBOOKOfficialLink(_facebookofficialid) {
	            if (_facebookofficialid == null) {
	                //console.log('à¸à¸£à¸¸à¸“à¸²à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸² facebook Official à¹ƒà¸™à¸£à¸°à¸šà¸š Central Management');
	                _facebookofficialid = '/';
	            } else {
	                _facebookofficialid = _facebookofficialid;
	            }

	            return _facebookofficialid;
	        }

	        function BuildSpinixRegisterLink(_registerURL) {
	            //TODO
	            //step 1 : standard url
	            _registerURL += '?key=' + currentkey + '&b=' + Sitebrand_id + '&a=' + Sitebrand_register_id;
	            //step 2 : custom param
	            //Referral member
	            if (typeof(getUrlParameter('r')) != "undefined" &&
	                getUrlParameter('r') !== true &&
	                getUrlParameter('r') !== null) {
	                //console.log("Found Referral Exist!" );
	                //TODO
	                localStorage.setItem('referral', getUrlParameter('r'));
	                SiteRegisterReferral = localStorage.getItem('referral');
	                _registerURL += '&r=' + SiteRegisterReferral;
	            } else {
	                //Check Referral from localstorage
	                if (localStorage.getItem('referral') != "" &&
	                    localStorage.getItem('referral') !== true &&
	                    localStorage.getItem('referral') !== null) {
	                    console.log("Found Referral on LocalStorage");
	                    //TODO
	                    _registerURL += '&r=' + localStorage.getItem('referral');

	                } else {
	                    //console.log("No Referral Exist!" );
	                    //TODO
	                    //NOTHING HERE
	                }
	            }
	            //step 3 : export
	            return _registerURL;
	        }

	        function BuildSpinixDiamondLink(_serverURL) {
	            //TODO
	            //step 1 : standard url
	            _serverURL += 'slot/index.html?key=' + currentkey + '&b=' + Sitebrand_id + '&a=' + Sitebrand_register_id;
	            //step 2 : custom param
	            //Referral member
	            if (typeof(getUrlParameter('r')) != "undefined" &&
	                getUrlParameter('r') !== true &&
	                getUrlParameter('r') !== null) {
	                //console.log("Found Referral Exist!" );
	                //TODO
	                localStorage.setItem('referral', getUrlParameter('r'));
	                SiteRegisterReferral = localStorage.getItem('referral');
	                _serverURL += '&r=' + SiteRegisterReferral;
	            } else {
	                //Check Referral from localstorage
	                if (localStorage.getItem('referral') != "" &&
	                    localStorage.getItem('referral') !== true &&
	                    localStorage.getItem('referral') !== null) {
	                    console.log("Found Referral on LocalStorage");
	                    //TODO
	                    _serverURL += '&r=' + localStorage.getItem('referral');

	                } else {
	                    //console.log("No Referral Exist!" );
	                    //TODO
	                    //NOTHING HERE
	                }
	            }
	            //SpinixDiamond background color
	            _serverURL += '&bg=' + iFrameBackgroundColor;
	            //step 3 : export
	            return _serverURL;
	        }

	        function getRandomString(length) {
	            var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	            var result = '';
	            for (var i = 0; i < length; i++) {
	                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
	            }
	            return result;
	        }

	        function BuildKey() {
	            let _key = '';
	            if (typeof(getUrlParameter('r')) != "undefined" &&
	                getUrlParameter('r') !== true &&
	                getUrlParameter('r') !== null) {
	                //console.log("Found Referral Exist!" );
	                //TODO
	                SiteRegisterReferral = getUrlParameter('r');
	                _key = Sitebrand_id + '-' + Sitebrand_register_id + '-' + SiteRegisterReferral + '-' + Date.now() + '-' + getRandomString(7);
	            } else {
	                //console.log("No Referral Exist!" );
	                //TODO
	                _key = Sitebrand_id + '-' + Sitebrand_register_id + '-' + SiteRegisterReferral + '-' + Date.now() + '-' + getRandomString(7);
	            }
	            return _key
	        }


	        //register
	        for (j = 0; j < SetRegisElementLink.length; j++) {
	            //Check Element Exist first
	            var element = document.getElementById(SetRegisElementLink[j]);
	            if (typeof(element) != 'undefined' && element != null) {
	                // Exists.
	                document.getElementById(SetRegisElementLink[j]).addEventListener("click", function() {
	                    window.location.assign(SpinixRegisterURL);
	                });
	                console.log("El: #" + SetRegisElementLink[j] + " Binding done.");
	            } else {
	                //Not Exist
	                console.log('ERROR: #' + SetRegisElementLink[j] + ' EL NOT EXIST.');
	            }
	        }

	        //lineofficial
	        for (j = 0; j < SetLINEOfficialLink.length; j++) {
	            //Check Element Exist first
	            var element = document.getElementById(SetLINEOfficialLink[j]);
	            if (typeof(element) != 'undefined' && element != null) {
	                // Exists.
	                document.getElementById(SetLINEOfficialLink[j]).addEventListener("click", function() {
	                    window.location.assign(SiteLINEOfficial);
	                });
	                console.log("El: #" + SetLINEOfficialLink[j] + " Binding done.");
	            } else {
	                //Not Exist
	                console.log('ERROR: #' + SetLINEOfficialLink[j] + ' EL NOT EXIST.');
	            }
	        }

	        //facebookofficial
	        for (j = 0; j < SetFACEBOOKOfficialLink.length; j++) {
	            //Check Element Exist first
	            var element = document.getElementById(SetFACEBOOKOfficialLink[j]);
	            if (typeof(element) != 'undefined' && element != null) {
	                // Exists.
	                document.getElementById(SetFACEBOOKOfficialLink[j]).addEventListener("click", function() {
	                    window.location.assign(SiteFACEBOOKOfficial);
	                });
	                console.log("El: #" + SetFACEBOOKOfficialLink[j] + " Binding done.");
	            } else {
	                //Not Exist
	                console.log('ERROR: #' + SetFACEBOOKOfficialLink[j] + ' EL NOT EXIST.');
	            }
	        }



	        //console.log( 'Register url : ' +SpinixRegisterURL );
	        //console.log( 'Diamond frame url : ' +SpinixDiamondURL );
	        console.log('Brand_id (fixed) : ' + Sitebrand_id);
	        console.log('Agent_id (fetch) : ' + Sitebrand_register_id);
	        console.log('Referal_id (optional) : ' + SiteRegisterReferral);
	        console.log('LINE Official  : ' + SiteLINEOfficial);
	        console.log('FACEBOOK Official  : ' + SiteFACEBOOKOfficial);



	    }); //siteconfig response ends


	    //document loadded don finish


	}, false);
	/**--------------------------------------------------------------------- */