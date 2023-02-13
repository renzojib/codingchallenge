window.onload = () => {
    const contentTitle = document.getElementById('content-section-h2');
    const contentName = document.getElementById('content-name');
    const contentSection = document.getElementById('main-wrapper-c');
    const signUpSection = document.getElementById('main-wrapper-s');
    const loginSection = document.getElementById('main-wrapper-l');
    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const signUpEmail = document.getElementById('signup-email');
    const signUpPw = document.getElementById('signup-pw');
    const signUpBtn = document.getElementById('signup-btn');
    const loginEmail = document.getElementById('login-email');
    const loginPw = document.getElementById('login-pw');
    const loginBtn = document.getElementById('login-btn');
    const loginNav = document.getElementById('login-a');
    const logoutNav = document.getElementById('logout-a');
    const signUpSuccess = document.getElementById('success-msg');
    const loginSpan = document.getElementById('login-span');
    const signUpSpan = document.getElementById('signup-span');
    const signUpError = document.getElementById('signup-error');
    const loginError = document.getElementById('login-error');
    const reqArticle = document.getElementById('request-article');
    const noRequest = document.getElementById('norequest-p');
    const baseUrl = 'http://localhost:8081/';

    (function () {
        if (sessionStorage.getItem('empInfo')) {
            let sessionInfo = JSON.parse(sessionStorage.getItem('empInfo'))
            if (sessionInfo.hasRequests) {
                reqArticle.innerHTML = sessionInfo.info
                displayContent(sessionInfo.name, sessionInfo.notAdmin)
            } else {
                displayContent(sessionInfo.name, sessionInfo.notAdmin)
                noRequest.style.display = 'inline-flex'
            }
        }
    })();


    async function register () {
        try {
            // Register user
            const response = await fetch(`${baseUrl}register`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fname: fname.value.trim(),
                    lname: lname.value.trim(),
                    email: signUpEmail.value.trim(),
                    password: signUpPw.value.trim()
                })
            })

            // Capture server error
            if (!response.ok) {
                let errData = await response.text()
                let errJson = JSON.parse(errData)
                throw new Error(errJson.error);
            }

            // Display success information if no error
            if (response.ok) {
                registerSuccess(response)
            }

        } catch (err) {
            err = String(err)
            signUpError.style.display = 'inline-flex'
            signUpError.innerHTML = err.replace('Error: ', '')
        }
    }

    async function login () {
        try {

            // Authenticate user and return user information
            const response = await fetch(`${baseUrl}login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginEmail.value,
                    password: loginPw.value
                })
            })

            // Capture server error
            if (!response.ok) {
                let errData = await response.text()
                let errJson = JSON.parse(errData)
                throw new Error(errJson.error);
            }

            if (response.ok) {
                const data = await response.json()
                const notAdmin = data.isAdmin === 'no' 

                // Check if user is not an employee
                if(!data.isEmployee) {
                    notEmployee()
                } else {

                    //  Check if employee is not an admin
                    if (notAdmin) {

                        // Fetch requests
                        const requests = await fetch(`${baseUrl}notadmin/${data.isEmployee}`)

                        // Capture server error
                        if (!requests.ok) {
                            let errRequestData = await requests.text()
                            let errRequestJson = JSON.parse(errRequestData)
                            throw new Error(errRequestJson.error);
                        }

                        // If no error display requests
                        if (requests.ok) {
                            let requestData = await requests.json()
                            resetForms()
                            displayContent(data.fname, notAdmin)
                            let infoArr = []
                            
                            // Verify that employee has requests
                            if (requestData.requests.length > 0) {
                                for ( let request of requestData.requests) {

                                    // isAdmin = 'no' requests template
                                    let info = `<div class="request-wrapper">
                                    <h3 class="requesth3">Request ID: ${request.request_id}</h3>
                                    <h3 class="requesth3">Date requested: ${request.date_requested}</h3>
                                    <h3 class="requesth3">Entry Time: ${request.entry_time}</h3>
                                    <h3 class="requesth3">Game Date: ${request.game_date}</h3>
                                    <h3 class="requesth3">Number of tickets: ${request.number_of_tickets}</h3>
                                    <h3 class="requesth3">Approved: ${request.isApproved}</h3>
                                    </div>`
                                    infoArr.push(info)
                                }

                                // Save session information for isAdmin = 'no'
                                let empInfo = JSON.stringify({
                                    info: infoArr.join(''),
                                    name: data.fname,
                                    hasRequests: true,
                                    notAdmin: true
                                })
                                sessionStorage.removeItem('empInfo')
                                sessionStorage.setItem('empInfo', empInfo)
                                reqArticle.innerHTML = infoArr.join('')
                            } else {

                                // Save session information for no request
                                let empInfo = JSON.stringify({
                                    name: data.fname,
                                    hasRequests: false,
                                    notAdmin: true
                                })
                                sessionStorage.removeItem('empInfo')
                                sessionStorage.setItem('empInfo', empInfo)

                                // Display no request message if no request
                                noRequest.style.display = 'inline-flex'
                            }
                        }
                    }  else {
                        // isAdmin = 'yes'
                        // Fetch all requests
                        const requests = await fetch(`${baseUrl}isadmin`)

                        // Capture server error
                        if (!requests.ok) {
                            let errRequestData = await requests.text()
                            let errRequestJson = JSON.parse(errRequestData)
                            throw new Error(errRequestJson.error);
                        }

                        // If no error display requests
                        if (requests.ok) {
                            let requestData = await requests.json()
                            let infoArr = []

                            for (let request of requestData.requests) {

                                // isAdmin = 'yes' requests template
                                    let info = `<div class="request-wrapper">
                                    <h3 class="requesth3">Name: ${request.Employee.name}</h3>
                                    <h3 class="requesth3">Request ID: ${request.request_id}</h3>
                                    <h3 class="requesth3">Date requested: ${request.date_requested}</h3>
                                    <h3 class="requesth3">Entry Time: ${request.entry_time}</h3>
                                    <h3 class="requesth3">Game Date: ${request.game_date}</h3>
                                    <h3 class="requesth3">Number of tickets: ${request.number_of_tickets}</h3>
                                    <h3 class="requesth3">Approved: ${request.isApproved}</h3>
                                    </div>`
                                    infoArr.push(info)
                            }

                            // Save session Info and display request for isAdmin = 'yes'
                            let empInfo = JSON.stringify({
                                info: infoArr.join(''),
                                name: data.fname,
                                hasRequests: true,
                                notAdmin: false
                            })
                            sessionStorage.removeItem('empInfo')
                            sessionStorage.setItem('empInfo', empInfo)

                            reqArticle.innerHTML = infoArr.join('')
                            resetForms()
                            displayContent(data.fname, notAdmin)
                        }

                    }                  
                }
            }

        } catch(err) {
            err = String(err)
            console.log(err)
            signUpSuccess.style.display = 'none'
            loginError.style.display = 'inline-flex'
            loginError.innerHTML = err.replace('Error: ', '')
        }
    }

    // Load login page on successful registration
    async function registerSuccess(response) {
        let data = await response.json()
        signUpSection.style.display = 'none'
        signUpSuccess.innerHTML = data.msg
        signUpSuccess.style.display = 'inline-flex'
        loginSection.style.display = 'flex'
    }

    // Display requests
    function displayContent(name, notAdmin) {
        if (notAdmin) {
            contentTitle.innerHTML = 'Your Requests:'
        } else {
            contentTitle.innerHTML = 'Employee Requests:'
        }
        contentTitle.style.display = 'block'
        contentName.innerHTML = name
        loginSection.style.display = 'none'
        signUpSection.style.display = 'none'
        loginNav.style.display = 'none'
        logoutNav.style.display = 'inline-flex'
        contentSection.style.display = 'block'
    }

    // Display error message if login email is not found in Employees model
    function notEmployee () {
        signUpSuccess.style.display = 'none'
        loginError.style.display = 'inline-flex'
        loginError.innerHTML = 'Only employees allowed! Please contact the HR department.'
    }

    // Clear all form
    function resetForms() {
        loginError.style.display = 'none'
        signUpSuccess.style.display = 'none'
        signUpError.style.display = 'none'
        document.querySelectorAll('input').forEach(form => form.value = '')
    }

    // Onclick events
    loginNav.onclick = () => {
        resetForms()
        signUpSection.style.display = 'none'
        loginSection.style.display = 'flex'
    }

    loginSpan.onclick = () => {
        resetForms()
        signUpSection.style.display = 'none'
        loginSection.style.display = 'flex'
    }

    signUpSpan.onclick = () => {
        resetForms()
        signUpSection.style.display = 'flex'
        loginSection.style.display = 'none'
    } 

    logoutNav.onclick = () => {
        sessionStorage.removeItem('empInfo')
        logoutNav.style.display = 'none'
        loginNav.style.display = 'inline-flex'
        signUpSection.style.display = 'flex'
        loginSection.style.display = 'none'
        contentSection.style.display = 'none'
    }

    loginBtn.onclick = login

    signUpBtn.onclick = register
}