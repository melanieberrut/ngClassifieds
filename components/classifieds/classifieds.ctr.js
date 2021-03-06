(function (){
	"use strict";

	angular
		.module("ngClassifieds")

		// Injecting $scope and the new factory
		.controller("classifiedsCtrl", function($scope, $http, $state, classifiedsFactory, $mdSidenav, $mdToast, $mdDialog){ 
				
				var vm = this;

				vm.categories;
				vm.classified;
				vm.classifieds;
				vm.closeSidebar = closeSidebar;
				vm.deleteClassified = deleteClassified;
				vm.editing;
				vm.editClassified = editClassified;
				vm.openSidebar = openSidebar;
				vm.saveClassified = saveClassified;
				vm.saveEdit = saveEdit;
				

				vm.classifieds = classifiedsFactory.ref;
				// wait for our data to be loaded
				vm.classifieds.$loaded().then(function(classifieds){
					vm.categories = getCategories(classifieds)
				})
				// // asynch - Moved to firebase
				// classifiedsFactory.getClassifieds()
				// .then(function(classifieds){
				// 	vm.classifieds = classifieds.data;
				// 	vm.categories = getCategories(vm.classifieds);
				// });

				$http.get("https://api.github.com/users").then(function(response){
					console.log(response);
				});

				// new classifieds
				$scope.$on("newClassified", function (event, classified) {
					vm.classifieds.$add(classified);
					// show toast
					showToast("classified saved!");

				})

				// Fake out user logged in contact details
				var contact = {
					name: "Melanie B",
					phone: "0707070707070",
					email: "test@test.com"
				}

				$scope.$on("editSaved", function (event, message) {
					showToast(message);
				});

				function openSidebar() {
					// open the sidebar
					// navigation to the new state
					$state.go("classifieds.new")
				}
				function closeSidebar() {
					// open the sidebar

					// using componenet ID
					$mdSidenav("left").close();
				}

				// parsing the classified object to the array
				function saveClassified(classified){
					// verify that at least one property is defined before sending
					// the object
					// to do: add validation on the form
					if (classified) {
						// attaching the contact details to object
						classified.contact = contact;
						vm.classifieds.push(classified);

						// Empty the submitted data to allow the user to enter new
						vm.classified = {};

						// close sidebar on save
						closeSidebar();

						// notfication to show
						showToast("classified added!")
					}


				}


				// Edit the classfied method
				function editClassified(classified){
					// second attribute parse object information via UI router
					// check app.js params
					$state.go("classifieds.edit", {
						id: classified.$id,// id replaced to $id to match firebase id
					});

				}
			
				function saveEdit(){
					vm.editing = false;
					// clear form
					vm.classified = {};
					// close side bar
					closeSidebar();

					showToast("Edit saved!");

				}

				// reusable show toast function
				function showToast(message) {
					$mdToast.show(
						$mdToast.simple()
							.content(message)
							.position("top, right")
							.hideDelay("3000")
					);
				}

				// Delete with 2 arguments: event and current element
				function deleteClassified(event, classified){
					// config confirm
					var confirm = $mdDialog.confirm()
						.title("Are you sure you want to delete " + classified.title + " ?")
						.ok("Yes")
						.cancel("No")
						.targetEvent(event);

					$mdDialog
						// promise
						.show(confirm)
						// what happens when this resolves
						.then(
							// FOR CLICK YES
							function(){
								vm.classifieds.$remove(classified);
								showToast("Classified deleted!")
						}, 
							// FOR CLICK NO
							function(){
								// to do
						});

				}

				// Taking out list of data: classifieds
				function getCategories(classifieds) {
					var categories = [];
					// iterating throught it, each items from it
					angular.forEach(classifieds, function(item){
						// for each item get the category of it
						angular.forEach(item.categories, function(category){
							categories.push(category);
						});
					});

					// we want to put unique category to avoid duplicate results
					return _.uniq(categories);
				}

		});
})();