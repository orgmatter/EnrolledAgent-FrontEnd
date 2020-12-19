var admin = {
    data() {
        return {
            status: false,
            permission: "You do not have permission to carry out this task",
            expired: "Token expired, please log in again",
            unknown: "An unknown error occured, please try again later",
            loading: false,
            toast: {
                info: this.infoToast,
                error: this.errorToast,
                success: this.successToast,
                warn: this.warnToast,
            } 
        };
    },
    filters: {
        capitalize: function (value) {
            if (!value) return "";
            value = value.toString();
            return value.toUpperCase();
        },
        lowercase: function (value) {
            if (!value) return "";
            value = value.toString();
            return value.toLowerCase();
        },
    },
    methods: {
        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        },
        makeRequest(params) {
            console.log(document.cookie, getCookie('XSRF-TOKEN'))
            fetch('/api/login', {
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: {
                    "CSRF-Token": getCookie('XSRF-TOKEN'),
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                method: 'POST',
                body: JSON.stringify({
                    "email": "ekeh.wisdom@gmail.com",
                    "password": "password"
                })
            })
        },
        infoToast(message, title){
            $.notify( message, "info") 
        },
        errorToast(message, title){
            $.notify(message, "error") 
        },
        warnToast(message, title){
            $.notify(message, "warn") 
        },
        successToast(message, title){
          $.notify( message, "success") 
        },
        isEmail(email) {
            const regEx = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
            if (email.match(regEx)) return true;
            else return false;
          },
          isEmpty(string) {
            if (!string) return true;
            if (string.trim() === "") return true;
            else return false;
          },
          isEqual(string1, string2) {
            if (string1 === string2) return true;
            else return false;
          },
          isLessThan(string, len) {
            if (string.length < len) return true;
            else return false;
          },
          isLessThanN(num, len) {
            if (Number(num) < len) return true;
            else return false;
          },
          isGreaterThanN(num, len) {
            return Number(num) > len;
          },
        async loadData(url, requestBody, method) {
            let res = await axios({
                url: url,
                method: method,
                data: requestBody,
                headers: {
                    "CSRF-Token": this.getCookie('XSRF-TOKEN'),
                    // apikey: this.APIKEY,
                    // Authorization: "Bearer " + this.get_user_token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).catch((err) => {
                try {
                    if( err.response != null && err.response.data != null)
                    this.toast.error(err.response.data.error.message, "Error");
                    else 
                    this.toast.error(
                        this.unknown,
                        "Error"
                    );
                    return false;
                } catch (e) {
                this.toast.error(
                        "An error occured please try again later or check your network connection",
                        "Error"
                    );
                    return false;
                }
            });

            return res.data;
        },
        showLoader() {
            this.loading = true;
        },
        hideLoader() {
            this.loading = false;
        },
    },
};