angular.module('MetronicApp').controller('scheduleController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {

    var starttime = new Date();
    starttime.setHours(8);
    starttime.setMinutes(0);
    var endtime = new Date();
    endtime.setHours(17);
    endtime.setMinutes(0);
    
    scope = $scope;  
    scope.values=[
    "00:00","00:15","00:30","00:45",
    "01:00","01:15","01:30","01:45",
    "02:00","02:15","02:30","02:45",
    "03:00","03:15","03:30","03:45",
    "04:00","04:15","04:30","04:45",
    "05:00","05:15","05:30","05:45",
    "06:00","06:15","06:30","06:45",
    "07:00","07:15","07:30","07:45",
    "08:00","08:15","08:30","08:45",
    "09:00","09:15","09:30","09:45",
    "10:00","10:15","10:30","10:45",
    "11:00","11:15","11:30","11:45",
    "12:00","12:15","12:30","12:45",
    "13:00","13:15","13:30","13:45",
    "14:00","14:15","14:30","14:45",
    "15:00","15:15","15:30","15:45",
    "16:00","16:15","16:30","16:45",
    "17:00","17:15","17:30","17:45",
    "18:00","18:15","18:30","18:45",
    "19:00","19:15","19:30","19:45",
    "20:00","20:15","20:30","20:45",
    "21:00","21:15","21:30","21:45",
    "22:00","22:15","22:30","22:45",
    "23:00","23:15","23:30","23:45"];

    $rootScope.did=$window.localStorage.getItem("userId");


    $scope.openPicker = function ($event, pickerInstance) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[pickerInstance] = true;
    };
    $scope.getAllHospital = function(){
        httpService.secureGet("doc/secure/getAllHospital/all")
        .success(function(response){
            console.log(response);
            $scope.data = response.hospitals;
        })
    }
    $scope.getAllHospital();
    $scope.selectAction = function (hos)
    {
        $rootScope.hid=hos.id;
        httpService.secureGet("doc/secure/getScheduleByDoctorAndHospital/" +$rootScope.did + "/" +$rootScope.hid)
        .success(function(response){
            console.log(response);
            if(response.doc){
                $rootScope.sid=response.doc._id;
            }else{
                $rootScope.sid=undefined;
            }
            $scope.shcedule = response.doc || {
                doctorId: $rootScope.did,
                hospitalId:$rootScope.hid,
                days : {    
                    Sunday      : [],
                    Monday      : [],
                    Tuesday     : [],   
                    Wednesday   : [],  
                    Thursday    : [],   
                    Friday      : [],
                    Saturday    : []        
                }
            }           
        });
    }
    
$scope.saveSchedule = function(daterange){
    console.log("daterange=",daterange);
    $rootScope.startDate=daterange.split('-')[0];
    $rootScope.endDate=daterange.split('-')[1];
    console.log("startdate.endDate",$rootScope.startDate,$rootScope.endDate);
    if($rootScope.sid==undefined)
    {
         httpService.securePost("doc/secure/createSchedule",$scope.shcedule)
         .success(function(response){
            console.log(response);
            $scope.ScheduleDateRange = response.doc;
            $scope.ScheduleDateRange.startDate=$rootScope.startDate;
            $scope.ScheduleDateRange.endDate=$rootScope.endDate;
            console.log("$scope.ScheduleDateRange",$scope.ScheduleDateRange);
            httpService.securePost("doc/secure/createScheduleDateRangeEntry",$scope.ScheduleDateRange)
            .success(function(response){
                console.log("createScheduleDateRangeEntry==",response);
            })
            slotUtility($scope.ScheduleDateRange);
            // $state.reload();
        });
    }
    else
     {
        httpService.securePut("doc/secure/updateSchedule/"+$rootScope.sid,$scope.shcedule)
        .success(function(response){
            console.log("update res====",response);
            $scope.ScheduleDateRange={
                doctorId: $rootScope.did,
                hospitalId: $rootScope.hid,
                startDate : $rootScope.startDate,
                endDate : $rootScope.endDate,
                days : {
                            Sunday      : $scope.shcedule.days.Sunday,
                            Monday      : $scope.shcedule.days.Monday,
                            Tuesday     : $scope.shcedule.days.Tuesday,   
                            Wednesday   : $scope.shcedule.days.Wednesday,   
                            Thursday    : $scope.shcedule.days.Thursday,   
                            Friday      : $scope.shcedule.days.Friday,
                            Saturday    : $scope.shcedule.days.Saturday        
                        }
            }
            console.log("$scope.ScheduleDateRange",$scope.ScheduleDateRange);
            httpService.securePost("doc/secure/createScheduleDateRangeEntry",$scope.ScheduleDateRange)
            .success(function(response){
                console.log("createScheduleDateRangeEntry==",response);
            })
            // slotUtility($scope.ScheduleDateRange);
        }); 
    }
}
function slotUtility(data)
{
    console.log("ScheduleDateRange+===",data);
    console.log("$rootScope.startdate==$rootScope.endDate",data.startDate,data.endDate);
    var d1 = new Date(data.startDate);
    var d2 = new Date(data.endDate);
    console.log("d1==d2",d1,d2);
    while(!(d1>d2))
    {
        var d3 = moment(d1);
        var day=d3.day();
        console.log("day=",day);
        if(day==0)
        {
            var obj=
            {
            
                doctorId : data.doctorId,
                hospitalId:data.hospitalId,
                dateSlot : d1,
                timeSlot : [],
            }
            for(var i=0;i<data.days.Sunday.length;i++)
            {
                 var cnt=0;
                 var start=data.days.Sunday[i].start;
                 var end=data.days.Sunday[i].end;
                 var s=start.split(":");
                 var e=end.split(":");
                 var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
                 var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
                 for(var j=st;j<se;)
                 {
                     var n=parseFloat(j).toFixed(2);
                     var last=n.toString().split(".")[1];
                     var n1=n.split(".");
                     var n2=n1[0]+":"+n1[1];
                     var final={};
                     final.start=n2;
                     final.flag=0;
                     j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                     if(last==45)
                     {
                         var l=n.split(".")[0];
                         j=parseInt(l)+1;
                     }
                     var n=n2.split(":");
                     if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                     {
                         var t=n[0]+":"+(parseInt(n[1])+15);
                         final.end=t;
                     }
                     else
                     {
                         var t=(parseInt(n[0])+1)+":00";
                         final.end=t;
                     }
                     final.index=cnt;
                     obj.timeSlot.push(final);
                     cnt++;
                 }
             }
             console.log("obj===",obj);
            httpService.securePost("doc/secure/createSlot",obj)
                 .success(function(response){
                    console.log(response);
            });
           
        }
        else if(day==1)
        {
           var obj=
            {
            
                doctorId : $rootScope.did,
                hospitalId:$rootScope.hid,
                dateSlot : d1,
                timeSlot : [],
            }
            for(var i=0;i<data.days.Monday.length;i++)
            {
                 var cnt=0;
                 var start=$scope.shcedule.days.Monday[i].start;
                 var end=$scope.shcedule.days.Monday[i].end;
                 var s=start.split(":");
                 var e=end.split(":");
                 var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
                 var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
                 for(var j=st;j<se;)
                 {
                     var n=parseFloat(j).toFixed(2);
                     var last=n.toString().split(".")[1];
                     var n1=n.split(".");
                     var n2=n1[0]+":"+n1[1];
                     var final={};
                     final.start=n2;
                     final.flag=0;
                     j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                     if(last==45)
                     {
                         var l=n.split(".")[0];
                         j=parseInt(l)+1;
                     }
                     var n=n2.split(":");
                     if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                     {
                         var t=n[0]+":"+(parseInt(n[1])+15);
                         final.end=t;
                     }
                     else
                     {
                         var t=(parseInt(n[0])+1)+":00";
                         final.end=t;
                     }
                     final.index=cnt;
                     obj.timeSlot.push(final);
                     cnt++;
                 }
             }
            httpService.securePost("doc/secure/createSlot",obj)
                 .success(function(response){
                    console.log(response);
            });
        }
        else if(day==2)
        {
            var obj=
            {
            
                doctorId : $rootScope.did,
                hospitalId:$rootScope.hid,
                dateSlot : d1,
                timeSlot : [],
            }
            for(var i=0;i<$scope.shcedule.days.Tuesday.length;i++)
            {
                 var cnt=0;
                 var start=$scope.shcedule.days.Tuesday[i].start;
                 var end=$scope.shcedule.days.Tuesday[i].end;
                 var s=start.split(":");
                 var e=end.split(":");
                 var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
                 var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
                 for(var j=st;j<se;)
                 {
                     var n=parseFloat(j).toFixed(2);
                     var last=n.toString().split(".")[1];
                     var n1=n.split(".");
                     var n2=n1[0]+":"+n1[1];
                     var final={};
                     final.start=n2;
                     final.flag=0;
                     j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                     if(last==45)
                     {
                         var l=n.split(".")[0];
                         j=parseInt(l)+1;
                     }
                     var n=n2.split(":");
                     if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                     {
                         var t=n[0]+":"+(parseInt(n[1])+15);
                         final.end=t;
                     }
                     else
                     {
                         var t=(parseInt(n[0])+1)+":00";
                         final.end=t;
                     }
                     final.index=cnt;
                     obj.timeSlot.push(final);
                     cnt++;
                 }
             }
            httpService.securePost("doc/secure/createSlot",obj)
                 .success(function(response){
                    console.log(response);
            });
        }
        else if(day==3)
        {
           var obj=
            {
            
                doctorId : $rootScope.did,
                hospitalId:$rootScope.hid,
                dateSlot : d1,
                timeSlot : [],
            }
            for(var i=0;i<$scope.shcedule.days.Wednesday.length;i++)
            {
                 var cnt=0;
                 var start=$scope.shcedule.days.Wednesday[i].start;
                 var end=$scope.shcedule.days.Wednesday[i].end;
                 var s=start.split(":");
                 var e=end.split(":");
                 var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
                 var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
                 for(var j=st;j<se;)
                 {
                     var n=parseFloat(j).toFixed(2);
                     var last=n.toString().split(".")[1];
                     var n1=n.split(".");
                     var n2=n1[0]+":"+n1[1];
                     var final={};
                     final.start=n2;
                     final.flag=0;
                     j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                     if(last==45)
                     {
                         var l=n.split(".")[0];
                         j=parseInt(l)+1;
                     }
                     var n=n2.split(":");
                     if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                     {
                         var t=n[0]+":"+(parseInt(n[1])+15);
                         final.end=t;
                     }
                     else
                     {
                         var t=(parseInt(n[0])+1)+":00";
                         final.end=t;
                     }
                     final.index=cnt;
                     obj.timeSlot.push(final);
                     cnt++;
                 }
             }
            httpService.securePost("doc/secure/createSlot",obj)
                 .success(function(response){
                    console.log(response);
            });
        }
        else if(day==4)
        {
            var obj=
            {
            
                doctorId : $rootScope.did,
                hospitalId:$rootScope.hid,
                dateSlot : d1,
                timeSlot : [],
            }
            for(var i=0;i<$scope.shcedule.days.Thursday.length;i++)
            {
                 var cnt=0;
                 var start=$scope.shcedule.days.Thursday[i].start;
                 var end=$scope.shcedule.days.Thursday[i].end;
                 var s=start.split(":");
                 var e=end.split(":");
                 var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
                 var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
                 for(var j=st;j<se;)
                 {
                     var n=parseFloat(j).toFixed(2);
                     var last=n.toString().split(".")[1];
                     var n1=n.split(".");
                     var n2=n1[0]+":"+n1[1];
                     var final={};
                     final.start=n2;
                     final.flag=0;
                     j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                     if(last==45)
                     {
                         var l=n.split(".")[0];
                         j=parseInt(l)+1;
                     }
                     var n=n2.split(":");
                     if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                     {
                         var t=n[0]+":"+(parseInt(n[1])+15);
                         final.end=t;
                     }
                     else
                     {
                         var t=(parseInt(n[0])+1)+":00";
                         final.end=t;
                     }
                     final.index=cnt;
                     obj.timeSlot.push(final);
                     cnt++;
                 }
             }
            httpService.securePost("doc/secure/createSlot",obj)
                 .success(function(response){
                    console.log(response);
            });
        }
        else if(day==5)
        {
           var obj=
            {
            
                doctorId : $rootScope.did,
                hospitalId:$rootScope.hid,
                dateSlot : d1,
                timeSlot : [],
            }
            for(var i=0;i<$scope.shcedule.days.Friday.length;i++)
            {
                 var cnt=0;
                 var start=$scope.shcedule.days.Friday[i].start;
                 var end=$scope.shcedule.days.Friday[i].end;
                 var s=start.split(":");
                 var e=end.split(":");
                 var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
                 var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
                 for(var j=st;j<se;)
                 {
                     var n=parseFloat(j).toFixed(2);
                     var last=n.toString().split(".")[1];
                     var n1=n.split(".");
                     var n2=n1[0]+":"+n1[1];
                     var final={};
                     final.start=n2;
                     final.flag=0;
                     j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                     if(last==45)
                     {
                         var l=n.split(".")[0];
                         j=parseInt(l)+1;
                     }
                     var n=n2.split(":");
                     if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                     {
                         var t=n[0]+":"+(parseInt(n[1])+15);
                         final.end=t;
                     }
                     else
                     {
                         var t=(parseInt(n[0])+1)+":00";
                         final.end=t;
                     }
                     final.index=cnt;
                     obj.timeSlot.push(final);
                     cnt++;
                 }
             }
            httpService.securePost("doc/secure/createSlot",obj)
                 .success(function(response){
                    console.log(response);
            });
        }
        else if(day==6)
        {
           var obj=
            {
            
                doctorId : $rootScope.did,
                hospitalId:$rootScope.hid,
                dateSlot : d1,
                timeSlot : [],
            }
            for(var i=0;i<$scope.shcedule.days.Saturday.length;i++)
            {
                 var cnt=0;
                 var start=$scope.shcedule.days.Saturday[i].start;
                 var end=$scope.shcedule.days.Saturday[i].end;
                 var s=start.split(":");
                 var e=end.split(":");
                 var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
                 var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
                 for(var j=st;j<se;)
                 {
                     var n=parseFloat(j).toFixed(2);
                     var last=n.toString().split(".")[1];
                     var n1=n.split(".");
                     var n2=n1[0]+":"+n1[1];
                     var final={};
                     final.start=n2;
                     final.flag=0;
                     j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                     if(last==45)
                     {
                         var l=n.split(".")[0];
                         j=parseInt(l)+1;
                     }
                     var n=n2.split(":");
                     if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                     {
                         var t=n[0]+":"+(parseInt(n[1])+15);
                         final.end=t;
                     }
                     else
                     {
                         var t=(parseInt(n[0])+1)+":00";
                         final.end=t;
                     }
                     final.index=cnt;
                     obj.timeSlot.push(final);
                     cnt++;
                 }
             }
            httpService.securePost("doc/secure/createSlot",obj)
                 .success(function(response){
                    console.log(response);
            });
        }
         console.log("d1=",d1);
         console.log("d2=",d2);
         var n=moment(d1).add(1,'days').format('YYYY-MM-DD');
         d1=new Date(n);
    }
    // var m= moment().day(1);
    // console.log("m===",m);
    // var n=d1.add('days',1);

}
$scope.updateSchedule = function(h){
    console.log("updateSchedule==",h);
     httpService.secureGet("doc/secure/getScheduleDateRangeEntryByDoctorAndHospital/"+$rootScope.did+"/"+h._id)
        .success(function(response){
            console.log("++00++",response);
            $scope.data = response.doc;
            console.log("$scope.data.length=",$scope.data.length);
            for(var i=0;i<$scope.data.length;i++)
            {
                var myDate = new Date(response.doc[i].startDate); 
                $scope.data[i].startDate=(myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();           
                var myDate = new Date(response.doc[i].endDate); 
                $scope.data[i].endDate=(myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();           
                              
            }
            $scope.hospitalList = $scope.data;

    })
}
$scope.displayRecords = function(h){
    console.log("h====",h);
    var obj={
        startDate : h.startDate,
        endDate : h.endDate
    };
    httpService.securePost("doc/secure/postScheduleDateRangeEntryByDoctorAndHospital/"+h.doctorId+"/"+h.hospitalId,obj)
        .success(function(response){
            console.log("response=()",response);
            $scope.daysList=response.doc[0];
        });
}
$scope.updateByDate= function(daysList){
    console.log("daysList===",daysList);
    console.log("id=",daysList._id);
    var id=daysList._id;
    httpService.securePut('doc/secure/updateScheduleDateRangeEntry/'+id,daysList)
    .success(function(response){
        console.log("updateByDate Response=",response);
        slotUtility1(daysList);
    });
}
function slotUtility1(daysList){
    var obj={
        startDate : daysList.startDate,
        endDate: daysList.endDate
    };
    httpService.securePost("doc/secure/getSlot/"+daysList.doctorId+"/"+daysList.hospitalId,obj)
    .success(function(response){
        data=response.doc[0];
        console.log("data====",data);
        var d1 = new Date(daysList.startDate);
        var d2 = new Date(daysList.endDate);
        console.log("d1 ==== d2",d1,d2);
        // while(!(d1>d2))
        // {
        //     var d3 = moment(d1);
        //     var day=d3.day();
        //     console.log("day=",day);
        //     if(day==0)
        //     {
        //         console.log("0 its sunday");
        //         var obj=
        //         {
                
        //             doctorId : daysList.doctorId,
        //             hospitalId:daysList.hospitalId,
        //             dateSlot : d1,
        //             timeSlot : [],
        //         }
        //         console.log("daysList.days.Sunday.length",daysList.days.Sunday.length);
        //         for(var i=0;i<daysList.days.Sunday.length;i++)
        //         {
        //             console.log("value of i",i);
        //              var cnt=0;
        //              var start=daysList.days.Sunday[i].start;
        //              var end=daysList.days.Sunday[i].end;
        //              var s=start.split(":");
        //              var e=end.split(":");
        //              var st=parseFloat(s[0])+parseFloat(0+"."+s[1]);
        //              var se=parseFloat(e[0])+parseFloat(0+"."+e[1]);
        //              console.log("st & se==",st,se);
        //              for(var j=st;j<se;)
        //              {
        //                  var flag=0;
        //                  var n=parseFloat(j).toFixed(2);
        //                  var last=n.toString().split(".")[1];
        //                  var n1=n.split(".");
        //                  var n2=n1[0]+":"+n1[1];
        //                  var final={};
        //                  console.log("data.timeSlot.length=",data.timeSlot.length);
                         // for(var k=0;k<data.timeSlot.length;k++)
                         // {  
                         //    console.log("inside for loop=k",k);
                         //    console.log("data.timeSlot[k].start==n2",data.timeSlot[k].start,n2);
                         //    if(data.timeSlot[k].start==n2)
                         //    {
                         //        console.log("matched==++");
                         //        final.start=data.timeSlot[k].start;
                         //        final.end=data.timeSlot[k].end;
                         //        final.flag=data.timeSlot[k].flag;
                         //        flag=1;
                         //        j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                         //         if(last==45)
                         //         {
                         //             var l=n.split(".")[0];
                         //             j=parseInt(l)+1;
                         //         }
                         //         break;
                         //    }
                         // }
                //         if(flag==0)
                //         {
                //              final.start=n2;
                //              final.flag=0;
                //              j=parseFloat((parseFloat(n)+0.15).toString()).toFixed(2);
                //              if(last==45)
                //              {
                //                  var l=n.split(".")[0];
                //                  j=parseInt(l)+1;
                //              }
                //              var n=n2.split(":");
                //              if(n[1]=="00"||n[1]=="15"||n[1]=="30")
                //              {
                //                  var t=n[0]+":"+(parseInt(n[1])+15);
                //                  final.end=t;
                //              }
                //              else
                //              {
                //                  var t=(parseInt(n[0])+1)+":00";
                //                  final.end=t;
                //              }
                //         }
                //          final.index=cnt;
                //          console.log("final=",final);
                //          obj.timeSlot.push(final);
                //          cnt++;
                //      }
                //  }
                // console.log("obj==updateByDate=",obj);
                // httpService.securePost("doc/secure/createSlot",obj)
                //      .success(function(response){
                //         console.log(response);
                // });
        //     }
        //     var n=moment(d1).add(1,'days').format('YYYY-MM-DD');
        //     d1=new Date(n);    
        // }

    });

}

Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_schedule'));

});