
var container;

function loginForm()
{
	var username,
		password,
		autologin,
		support,
		supportReturnUrl;

	support=arguments.length&&arguments[0]===true;
	supportReturnUrl=support&&arguments.length>1?arguments[1]:null;

	kigoFront.setUrlParam('');

	container.empty().append(kigoDom.create('div',{'class':'form login-form'})
			.append(kigoDom.create('div',{'class':'threecols col-left'})
				.append(kigoDom.nbsp),
				kigoDom.create('div',{'class':'threecols col-middle'}).append(kigoDom.create('h2').append(support?'Support login':'Login'),
					kigoDom.create('form',null,null,{
						'submit':function()
						{	
							var missing=[];
							kigoForm2.unmarkMissing([username,password]);

							if(!kigo.strlen(kigo.trim(username.domNode().value)))
								missing.push(username);
							if(!kigo.strlen(kigo.trim(password.domNode().value)))
								missing.push(password);
							if(missing.length)
							{
								kigoForm2.markMissing(missing);
								kigoPopup.warn('Username and password','Please provide your username and your password.',function(){
									missing[0].domNode().focus();
								});
								return false;
							}
							if(!support)
							{
								new kigoAjaxRequest3('Account/login',{
										'USERNAME':kigo.trim(username.domNode().value),
										'PASSWORD':kigo.trim(password.domNode().value),
										'AUTOLOGIN':autologin.checked()
									},{
										'on_reply':function(reply)
										{
											if(kigo.is_object(reply))
											{
												if(reply.AUTOLOGIN!==null)
													kigoCookie.set('AUTOLOGIN',reply.AUTOLOGIN,{
														'path':'/',
														'expires_seconds':2592000,
														'secure':true}
													);
												else
													kigoCookie.unset('AUTOLOGIN',{
														'path':'/'
													});

												switch(reply.ACCOUNT_TYPE)
												{
													case'RA':
														kigoFront.goTo('/ra/');
														break;

													case'OWNER':kigoFront.goTo('/owner/');
														break;
												}
											}
											else if(reply===true)
												badCredentials();
											else if(reply===false)
												accountDeactivated();
											else
												return false;

											return true;
										}
									}
								);
							} else
							{
								new kigoAjaxRequest3('Account/support_login',{
									'USERNAME':kigo.trim(username.domNode().value),
									'PASSWORD':kigo.trim(password.domNode().value)},
									{
										'on_reply':function(reply)
										{
											if(!kigo.is_string(reply))
												return false;
											if(kigo.substr(reply,0,3)==='OK:')
											{
												kigoFront.goTo(
													kigoZendesk.supportCenterURL(
														'/access/jwt?jwt='+kigo.rawurlencode(kigo.substr(reply,3))+
														(supportReturnUrl!==null ? '&return_to='+kigo.rawurlencode(supportReturnUrl):'')
													)
												);
											}
											else if(reply==='CRED')
												badCredentials();
											else if(reply==='DEACTIVATED')
												accountDeactivated();
											else if(reply==='NOT_RA')
											{
												kigoPopup.warn('Kigo support not available to owners','The Kigo support is available to rental agency accounts only.'+'\n'+'\n'+'Please contact your rental agency for support.');
											}
											else
												return false;

											return true;
										}
									}
								);
							}
							function badCredentials()
							{
								kigoPopup.warn('Incorrect username and/or password','The username and/or password you have provided are incorrect.',function()
								{
									username.domNode().focus();
								});
							}

							function accountDeactivated()
							{
								kigoPopup.error('Your account was deactivated','We regret to inform you that your account has been deactivated.\n'+'\n'+'Please contact Kigo customer support for more information.');
							}
							return false;
						}
					}
				).append(kigoDom.create('p').append('Username',kigoDom.create('br'),username=kigoDom.create('input',{'type':'text','class':'text'})),kigoDom.create('p').append('Password',kigoDom.create('br'),password=kigoDom.create('input',{'type':'password','class':'text'})),(!support?kigoDom.create('p').append(kigoDom.create('label').append((autologin=(new kigoCheckbox())).dom(),' ','Remember me'),' ',kigoTooltip.icon(['By selecting "Remember me" you will stay logged',kigoDom.create('br'),'into this computer until you click logout.',kigoDom.create('br'),kigoDom.create('br'),'If this is a public computer, or if you are using',kigoDom.create('br'),'more than one Kigo account on this computer, you',kigoDom.create('br'),'should not use this feature.'])):null),kigoDom.create('button',{'type':'submit','class':'primary'}).append('Log in')),kigoDom.create('br'),kigoDom.create('a',{'href':'#','title':'Recover your password'},null,{'click':function(){passwordRecovery(support);return false;}}).append('Forgot password?')),kigoDom.create('div',{'class':'threecols col-right'}).append(kigoDom.nbsp),kigoDom.create('div',{'class':'clear'})));username.domNode().focus();}

function passwordRecovery()
{
	var support=arguments.length&&arguments[0]===true;var email;kigoFront.setUrlParam('password');container.empty().append(kigoDom.create('div',{'class':'form pwdrecover-form'}).append(kigoDom.create('div',{'class':'threecols col-left'}).append(kigoDom.nbsp),kigoDom.create('div',{'class':'threecols col-middle'}).append(kigoDom.create('h2').append('Password recovery'),'Please provide your email address for receiving a link that will allow you to set up a new password for your account.',kigoDom.create('form',null,null,{'submit':function()
{kigoForm2.unmarkMissing(email);if(!kigoVal.EMAIL(email.domNode().value))
{kigoForm2.markMissing(email);kigoPopup.warn('Email address required','Please enter your email address for receiving the password recovery link',function(){email.domNode().focus();});return false;}
new kigoAjaxRequest3('Account/pwdrecover',kigo.trim(email.domNode().value),{'on_reply':function(reply)
{if(reply===true)
{kigoPopup.ok('Email was sent','An email was sent to the following address:\n'+'\n'+
kigo.trim(email.domNode().value)+'\n'+'\n'+'with instructions on setting up a new password for your account.',function(){loginForm(support);});}
else if(reply===false)
{kigoPopup.warn('Kigo account not found','Sorry, there is no Kigo account associated with the provided email address.\n'+'Please specify the address related to your account.',function(){email.domNode().select();});}
else
return false;return true;}});return false;}}).append(kigoDom.create('p').append('Email address',kigoDom.create('br'),email=kigoDom.create('input',{'type':'text','class':'text wide'})),kigoDom.create('button',{'type':'submit','class':'primary'}).append('Recover my password')),kigoDom.create('br'),kigoDom.create('a',{'href':'#','title':'Cancel your password recovery request and return to login'},null,{'click':function(){loginForm(support);return false;}}).append('Return to login')),kigoDom.create('div',{'class':'threecols col-right'}).append(kigoDom.nbsp),kigoDom.create('div',{'class':'clear'})));email.domNode().focus();}

kigoFront.main(function(urlParam)
{
	var support = (window.location.pathname==='/support-login.php');
	(new kigoDom('container'))
		.append(container = kigoDom.create('div'),
			(!support ? [kigoDom.create('div',{
				'class':'separator'
			}),
			kigoDom
				.create('div')
				.append(kigoDom.create('div',{'style':'float: left'})
				.append('Have questions or need help? Please visit our support center at ',
			kigoFront.link({
				'url':kigoZendesk.supportCenterURL(),
				'action':function()
				{
					window.open(kigoZendesk.supportCenterURL());
				},
				'title':'Support center'
			})
				.append(kigoZendesk.supportCenterURL()),'.'),
			kigoDom
				.create('div',{'style':'float: right'})
				.append(kigoDom.create('a',{'href':'http://kigo.net','title':'Kigo home'})
				.append('Home')),
			kigoDom
				.create('div',{'class':'clear'}))] : null));

		if(support)
{loginForm(support,(new kigoList(kigo.explode('&',urlParam))).reduce(function(value,idx,input)
{if(input===null&&kigo.substr(value,0,'return_to='.length)==='return_to='&&kigo.substr(value,'return_to='.length,kigoZendesk.supportCenterURL().length)===kigoZendesk.supportCenterURL())
return kigo.substr(value,'return_to='.length);return input;}));}
else
{if(urlParam==='password')
passwordRecovery();else if(kigo.substr(urlParam,0,2)==='o-'&&(urlParam=kigo.explode('-',kigo.substr(urlParam,2),2)).length===2)
{kigoCookie.unset('AUTOLOGIN',{'path':'/'});kigoCookie.set(kigo.CFG.APP.SESSION_NAME,urlParam[0],{'path':'/'});kigoCookie.set('OWNER_LOGOUT',urlParam[1],{'path':'/owner'});kigoFront.goTo('/owner/');}
else if(kigoCookie.get('AUTOLOGIN'))
{new kigoAjaxRequest3('Account/autologin',kigoCookie.get('AUTOLOGIN'),{'on_timeout':loginForm,'on_error':loginForm,'on_reply':function(accountType)
{if(accountType==='RA')
kigoFront.goTo('/ra/');else if(accountType==='OWNER')
kigoFront.goTo('/owner/');else if(accountType===true)
{kigoCookie.unset('AUTOLOGIN',{'path':'/'});loginForm();}
else
loginForm();return true;}});}
else
loginForm();}});
