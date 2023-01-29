import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'wen2289',
            products: [],
            productDetail: {
                imagesUrl: []
            },
            isNew: false
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        this.checkUser();
    },
    methods: {
        checkUser() {
            axios.defaults.headers.common['Authorization'] = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //每次(default)發出請求時，header加入此參數
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    this.getData();
                })
                .catch((err) => {
                    alert("請先登入平台");
                    location.assign("login.html");
                })
        },
        getData() {
            axios.defaults.headers.common['Authorization'] = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*=\s*([^;]*).*$)|^.*$/, '$1');
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
                .then((res) => {
                    this.products = res.data.products;
                    //console.log(this.products);
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        openModal(type, productDetail) {
            if (type === 'new') {
                this.isNew = true;
                this.productDetail = {
                    imagesUrl: []
                };
                productModal.show();
            }
            else if (type === 'edit') {
                this.isNew = false;
                this.productDetail = { ...productDetail };
                productModal.show();
            }
            else if(type === 'delete') {
                this.productDetail = { ...productDetail };
                delProductModal.show();
            }
            
            // setTimeout(() => {
            //     productModal.hide();
            // }, 5000);
        },
        updateProduct() {
            axios.defaults.headers.common['Authorization'] = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //每次(default)發出請求時，header加入此參數
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';
            if(!this.isNew) {
                http = 'put'
                url += `/${this.productDetail.id}`
            }
            axios[http](url, { data: this.productDetail })
                .then((res) => {
                    alert(res.data.message);
                    productModal.hide();
                    this.getData();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        deletProduct(productId) {
            axios.defaults.headers.common['Authorization'] = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //每次(default)發出請求時，header加入此參數
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${productId}`)
                .then((res) => {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        }
    }
}).mount('#app');