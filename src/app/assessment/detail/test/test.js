'use strict';

/**
 * @name  testConfig
 * @description Configuration of the tests list
 */

function testConfig($stateProvider){
    $stateProvider
        .state('assessment.detail.tests',{
            url: '/tests',
            resolve: {
                list: function(Restangular,$stateParams){
                    return Restangular
                        .one('assessment', $stateParams.id)
                        .getList('test');
                }
            },
            views: {
                assessmentTab : {
                    templateUrl: 'app/assessment/detail/test/list.tpl.html',
                    controller: 'TestListCtrl as tests'
                }
            }
        })
}



/**
 * @name  TestistCtrl
 * @description Controller of the test list in the tabs
 */
function TestListCtrl($mdToast,list, $mdDialog, Restangular, $stateParams) {

    var self = this;

    this.list = list;

    this.dialog = function(event,test,index){
        $mdDialog
            .show({
                templateUrl: 'app/assessment/detail/test/dialog.tpl.html',
                controller: 'TestCtrl as test',
                targetEvent : event,
                locals: {
                    data:  test || {}
                }
            })
            .then(function(response){
                if(response.type == 'creation'){
                    self.list.push(response.data);
                    $mdToast.show({
                        template: '<md-toast>Test created</md-toast>'
                    })
                }else{
                    self.list[index] = response.data;
                    $mdToast.show({
                        template: '<md-toast>Test updated</md-toast>'
                    })
                }

            })
    };
    this.remove = function(event, testId){
        var confirm = $mdDialog
            .confirm()
            .title('Confirm suppression ?')
            .ariaLabel('suppression dialog')
            .ok('Remove')
            .cancel('Cancel')
            .targetEvent(event);

        $mdDialog.show(confirm)
            .then(Restangular
                .one('assessment',$stateParams.id)
                .one('test',testId)
                .remove())
            .then(function(){
                //todo remove from the local list
                $mdToast.show({
                    template: '<md-toast>test removed !</md-toast>'
                })
            })
    }
}

/**
 * @name  TestCtrl
 * @description Controller of the dialog of test edition
 */
function TestCtrl(data,$stateParams,Restangular,$mdDialog) {
    var self = this;

    this.data = Restangular.copy(data);

    this.save = function(){
        if (self.data._id) {
            self.data
                .put()
                .then(function (updatedGuide) {
                    $mdDialog.hide({
                        type: 'update',
                        data: updatedGuide
                    });
                });
        } else {
            Restangular
                .one('assessment',$stateParams.id)
                .all('test')
                .post(self.data)
                .then(function (createdGuide) {
                    $mdDialog.hide({
                        type: 'creation',
                        data: createdGuide
                    });
                });
        }
    };

    this.cancel = function(){
        $mdDialog.cancel();
    };
}

angular.module('assessment.detail.tests',[])
    .config(testConfig)
    .controller('TestListCtrl', TestListCtrl)
    .controller('TestCtrl', TestCtrl);
