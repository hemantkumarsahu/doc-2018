    /* Setup Rounting For All Pages */
MetronicApp.config(function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url

    $urlRouterProvider.otherwise("login");

    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "views/login.html",
        })

    .state("forgot", {
        url: "/forgot",
        templateUrl: "views/forgot.html",
    })

    .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "tpl/home.html",
            controller: "AppController",
        })

    .state('app.dashboard', {
               url: "/dashboard/:doctorId",
            templateUrl: "views/dashboard.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "dashboardCtrl",
            cache: false
        })
        
    .state('app.hospital', {
            url: "/hospital",
            templateUrl: "views/hospital/hospital.html",
            data: {pageTitle: 'Hospital'},
            controller: "HospitalController",
            
        })

        .state('app.specility', {
            url: "/specility",
            templateUrl: "views/specility/specility.html",
            data: {pageTitle: 'Specility'},
            controller: "specilityController",
            
        })

        .state('app.appointment', {
            url: "/appointment",
            templateUrl: "views/appointment/appointment.html",
            data: {pageTitle: 'Appointments'},
            controller: "appointmentController",
            
        })

        // .state('app.createAvalibility', {
        //     url: "/avalibility",
        //     templateUrl: "views/availability/availability.html",
        //     data: {pageTitle: 'Availability'},
        //     controller: "availabilityController",
            
        // })

         .state('app.schedule', {
            url: "/schedule/",
            templateUrl: "views/schedule/master.html",
            data: {pageTitle: 'Schedule'},
            controller: "scheduleController"
            
        })
       .state('app.patient', {
            url: "/patient",
            templateUrl: "views/patient/patient.html",
            data: {pageTitle: 'Patient'},
            controller: "patientController"
            
        })

       .state('app.patientReport', {
            url: "/patientReport",
            templateUrl: "views/patientReport/patientReport.html",
            data: {pageTitle: 'Patient-Report'},
            controller: "patientReportController"
            
        })

        .state('app.doctor', {
            url: "/doctor",
            templateUrl: "views/doctor/doctor.html",
            data: {pageTitle: 'Doctor'},
            controller: "doctorController"
            
        })
        .state('app.degree', {
            url: "/degree",
            templateUrl: "views/degree/degree.html",
            data: {pageTitle: 'Degree'},
            controller: "degreeController"
            
        })
         .state('app.pescription', {
            url: "/pescription",
            templateUrl: "views/pescription/pescription.html",
            data: {pageTitle: 'Pescription'},
            controller: "pescriptionController"
            
        })
        .state('app.checkup', {
            url: "/checkup",
            templateUrl: "views/checkup/checkup.html",
            data: {pageTitle: 'CheckUp'},
            controller: "checkupCtrl"
            
        })

        .state('app.note', {
            url: "/note",
            templateUrl: "views/note/note.html",
            data: {pageTitle: 'Note'},
            controller: "noteController"
            
        })
        .state("app.myProfile", {
            url: "/myProfile/:companyId",
            templateUrl: "views/myProfile/addEmployee.html",
            data: { pageTitle: 'User Profile' },
            controller: "myProfileCtrl"
        })
        .state("app.master", {
            url: "/master/:companyId",
            templateUrl: "views/master/master.html",
            data: { pageTitle: 'Masters' },
            controller: "masterCtrl"
        })
        
        
        
});