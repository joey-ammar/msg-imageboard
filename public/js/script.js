(function () {
	//The component part starts here
	Vue.component('first-component', {
		template: '#template',
		props: ['id'],
		mounted: function () {
			//Connected to the watch
			this.showId();
			console.log('connected to the id watch');
		},
		data: function () {
			return {
				//Images part
				image: {
					url: '',
					title: '',
					description: '',
					username: '',
					created_at: '',
					comment: '',
				},
				//Comments part
				comments: [],
				username: '',
				comment: '',
				created_at: '',
			};
		},
		watch: {
			//whenever our images id changes, this function will run. its keeping an eye on imageId
			//connect to the mounted part
			id: function () {
				console.log('connected to the mounted');
				this.showId();
			},
		},
		methods: {
			//showId
			showId: function () {
				var self = this;
				console.log('id in mounted of my component: ', this.id);
				//The axios part starts here
				axios
					.post('/getImage', { id: this.id })
					.then(function (response) {
						console.log(
							'This is the response data: ',
							response.data
						);
						self.image = response.data.shift();
						self.comments = response.data[0];
					})
					.catch(function (error) {
						console.log('You are in the error zone!');
					});
			},
			//CloseModal
			closeModal: function () {
				console.log('i am emitting from the component... (child)');
				this.$emit('close');
			},
			//makeComment
			makeComment: function (e) {
				e.preventDefault();
				console.log('making some things here');
				var self = this;
				console.log(self);
				console.log('Im about to make some comments');
				var comment = {
					username: this.username,
					comment: this.comment,
					image_id: this.id,
				};
				console.log('I am making the comment ');
				//The axios part starts here
				axios
					.post('/getPost', comment)
					.then(function (response) {
						console.log('inside axios');
						self.comments.unshift(response.data[0]);
					})
					.catch(function (error) {
						console.log(
							'you are in the error zone in the axios comments',
							error
						);
					});
			},
		},
	});
	new Vue({
		el: '#main',
		//Vue data part
		data: {
			selectedImage: location.hash.slice(1),
			addPost: ' Add Image',
			checkPorfile: 'Check your images',
			images: [],
			title: '',
			description: '',
			username: '',
			file: null,
			pics: true,
		},
		mounted: function () {
			var self = this;
			//The axios part starts here
			axios.get('/images').then(function (response) {
				console.log('response', response);
				self.images = response.data;
			});
			//Event listener
			window.addEventListener('hashchange', function () {
				console.log('hash change has fired!');
				console.log(location.hash);
				self.selectedImage = location.hash.slice(1);
			});
		},

		methods: {
			//CloseMe method
			closeMe: function () {
				console.log('i am the parent, i will close you');
				this.selectedImage = null;
			},
			//handleClick
			handleClick: function (e) {
				e.preventDefault();
				console.log('this', this);
				var self = this;
				var formData = new FormData();
				formData.append('title', this.title);
				formData.append('description', this.description);
				formData.append('username', this.username);
				formData.append('file', this.file);
				//The axios part starts here
				axios
					.post('/upload', formData)
					.then(function (response) {
						console.log('response', response);
						self.images.unshift(response.data[0]);
					})
					.catch(function (error) {
						console.log(
							'You are in the error axios handleClick',
							error
						);
					});
			},
			//handleChange
			handleChange: function (e) {
				console.log('handleChange is running!');
				console.log('file: ', e.target.files[0]);
				this.file = e.target.files[0];
			},
			//pullImage
			pullImage: function (e) {
				var self = this;
				console.log('Self this');
				var imageLength = this.images.length - 1;
				console.log('imageLength  :', imageLength);
				var backId = {
					id: this.images[imageLength].id,
				};
				//The axios part starts here
				axios
					.post('/getMImages', backId)
					.then(function (response) {
						var responseImage = response.data.length - 1;
						console.log('responseImage', responseImage);
						var lowId = response.data[responseImage].lowest_id;
						var backId = response.data[responseImage].id;
						if (backId === lowId) {
							self.pics = false;
						}
						self.images.push(...response.data);
					})
					.catch(function (response) {
						console.log('You are in the last error!');
					});
			},
		},
	});
})();
