'use strict';

/**
 * @name  config
 * @description config block
 */
function assessmentConfig($stateProvider) {
    $stateProvider
        .state('assessment.edit', {
            url: '/:id',
            resolve: {
                assessment : function(Restangular,$stateParams){
                    if($stateParams.id) {
                        return Restangular.one('assessment', $stateParams.id).get();
                    }else{
                        return {};
                    }
                }
            },
            views: {
                assess: {
                    templateUrl: 'app/assessment/edit/assessment.tpl.html',
                    controller: 'AssessmentCtrl as assessment'
                }
            }
        });
}


/**
 * @name  Assessment
 * @description Controller
 */
function AssessmentCtrl($stateParams, Restangular, $mdToast, $state, assessment, assessmentsList) {
    var self = this;

    assessmentsList.current = assessment;

    this.data = assessmentsList;

    this.exist = $stateParams.id;

    this.destroy = function () {
        self.data
            .remove()
            .then(function () {
                $mdToast.show({
                    template: '<md-toast>Assessment removed</md-toast>'
                });
                $state.go('assessment.creation');
            });
    };

    this.save = function () {
        if (self.data._id) {
            self.data
                .put()
                .then(function (updatedAssessment) {
                    //todo update the list
                    $mdToast.show({
                        template: '<md-toast>Assessment updated</md-toast>'
                    });
                });
        } else {
            Restangular.all('assessment')
                .post(self.data)
                .then(function (createdAssessment) {
                    assessmentsList.data.push(createdAssessment);
                    $mdToast.show({
                        template: '<md-toast>Assessment created</md-toast>'
                    });
                    $state.go('assessment.edit', {id: assessment._id});
                });
        }
    };
}

angular.module('assessment.edit', [])
    .config(assessmentConfig)
    .controller('AssessmentCtrl', AssessmentCtrl);
