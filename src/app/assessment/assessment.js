angular.module('assessment', [
    'ui.router'
])
    .config(function($stateProvider){
        $stateProvider
            .state('assessment',{
                url : '/assessment',
                abstract : true,
                templateUrl : 'assessment/templates/assessments.tpl.html',
                controller : 'AssessmentsCtrl as app',
                resolve : {
                    assessments : function($atAssessment){
                        return $atAssessment.fetchAll();
                    }
                }
            })
            .state('assessment.details',{
                url : '/details/:id',
                resolve : {
                    assessment : function($atAssessment,$stateParams){
                        return $atAssessment.fetchOne($stateParams.id);
                    }
                },
                views : {
                    assess : {
                        templateUrl : 'assessment/templates/assessment.tpl.html',
                        controller : 'AssessmentCtrl as app'
                    }
                }
            })
            .state('assessment.creation',{
                url : '/new',
                views : {
                    assess : {
                        templateUrl : 'assessment/templates/assessment-creation.tpl.html',
                        controller : 'AssessmentCreationCtrl as app'
                    }
                }
            });
    })
    .controller('AssessmentsCtrl',function(assessments){
        this.assessments = assessments;

    })
    .controller('AssessmentCtrl',function(assessment,AceConfig,$atAssessment,$mdBottomSheet,$mdToast){
        var self = this;
        this.AceConfig = AceConfig;
        this.assessment = assessment;

        this.delete = function(){
            $atAssessment.delete(assessment._id).then(function(){

            });
        };

        this.update = function(){
            $atAssessment.update(assessment._id,assessment).then(function(){

            });
        };

        this.bottomSheet = function($event,type){
            var option = {
                targetEvent : $event
            };
            switch(type){
                case 'tip':
                    option.templateUrl = 'assessment/templates/bottom/tip.tpl.html';
                    option.controller = 'TipCtrl as tip';
                    break;
                case 'guide':
                    option.templateUrl = 'assessment/templates/bottom/guide.tpl.html';
                    option.controller = 'GuideCtrl as guide';
                    break;
                case 'test':
                    option.templateUrl = 'assessment/templates/bottom/test.tpl.html';
                    option.controller = 'TestCtrl as test';
                    break;
            }
            $mdBottomSheet.show(option);
        };
    })


    .controller('AssessmentCreationCtrl',function($atAssessment,AceConfig){
        this.AceConfig = AceConfig;
        this.createAssessment = $atAssessment.create;
    });