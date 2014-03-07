'use strict';

treeherder.factory('thPinboard',
                   ['$http', 'thUrl', 'ThJobClassificationModel', '$rootScope',
                   function($http, thUrl, ThJobClassificationModel, $rootScope) {

    var pinnedJobs = {};
    var relatedBugs = {};

    var classifyAndRelateBugs = function(job) {
        var classification = this;
        classification.job_id = job.id;

        console.log("classification: " + JSON.stringify(classification) + " for job: " + job.job_type_name);
        classification.create();
    };

    var api = {
        pinJob: function(job) {
            pinnedJobs[job.id] = job;
            // update the ui because these are added outside the angular event
            // model.
            $rootScope.$apply();
        },

        unPinJob: function(id) {
            delete pinnedJobs[id];
        },

        unPinAll: function() {
            for (var id in pinnedJobs) {
                if (pinnedJobs.hasOwnProperty(id)) { delete pinnedJobs[id]; } }
        },

        addBug: function(bug) {
            relatedBugs[bug.id] = bug;
        },

        removeBug: function(id) {
            delete relatedBugs[id];
        },

        // open form to create a new note
        createNewClassification: function() {
            return new ThJobClassificationModel({
                note: "",
                who: null,
                failure_classification_id: -1
            });
        },

        // save the classification and related bugs to all pinned jobs
        save: function(classification) {
            // add job_id to the ThJobClassificationModel.
            _.each(pinnedJobs, classifyAndRelateBugs, classification);
        },

        hasPinnedJobs: function() {
            return !_.isEmpty(pinnedJobs);
        },
        pinnedJobs: pinnedJobs,
        relatedBugs: relatedBugs
    };

    return api;
}]);

