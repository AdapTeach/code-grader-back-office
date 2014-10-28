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
                        controller : 'AssessmentCtrl as assessment'
                    }
                }
            })
            .state('assessment.creation',{
                url : '/new',
                views : {
                    assess : {
                        templateUrl : 'assessment/templates/assessment-creation.tpl.html',
                        controller : 'AssessmentCreationCtrl as assessment'
                    }
                }
            });
    })
    .controller('AssessmentsCtrl',function(assessments,AceConfig,$mdBottomSheet,$atAssessment){
        this.assessments = $atAssessment.list;
        this.AceConfig = AceConfig;
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
    .controller('AssessmentCtrl',function(assessment,$atAssessment,$mdToast,$state){
        angular.extend(this,assessment);

        this.delete = function(){
            $atAssessment.delete(this).then(function(){
                $mdToast.show({
                    template : '<md-toast>Assessment removed</md-toast>'
                });
                $state.go('assessment.creation');
            });
        };

        this.update = function(){
            var options = {
                _id : this._id,
                startCode : this.startCode,
                title : this.title,
                instructions : this.instructions
            };
            $atAssessment.update(options).then(function(){
                angular.extend(this,$atAssessment.data);
                $mdToast.show({
                    template : '<md-toast>Assessment updated</md-toast>'
                })
            });
        };
    })
    .controller('AssessmentCreationCtrl',function($atAssessment,$state){
        this.create = function(){
            $atAssessment.create(this).then(function(assessId){
                $mdToast.show({
                    template : '<md-toast>Assessment created</md-toast>'
                });
                $state.go('assessment.details',{ id : assessId });
            });
        };
    });