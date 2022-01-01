$(document).ready(function() {
	var RECORD;
	$("#logout").ready(function() {
		//init sidebar
		$(".nav-link").removeClass("active");
		$("#").addClass("active");
		$("#").parent().addClass("menu-open");
		$("#Credit").addClass("active");
	});
	
	toastr.warning("Transmission with server in progress...", "Please wait a moment");
	
	//get the record in database and render to a table	
	var loanid;
	
	//use ajax to connect and transfer data 
	$.post("SearchServlet",  //post the parameter to servlet:call the specified function 
	      {
		     "method":"obtain"  //get the data stored in session with "obtain"
	      },
	      function(ret){
		     RECORD=ret;
		     
		     $.post("ManagerServlet",
	     {
		    "loanID": RECORD,    //get the data stored in database with the primary key "loanID" and the function "QuOneLs" 
		    "method":"QuOneLs"		    
	     },
	     function(ret){ 
		
		 if (ret == null) {
			//the tip
			swal({
				title: "wrong number",
				text: "Wrong number, about to go to Loan Inquiry and select the order that needs to check?",
				type: "error",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55 !important",
				confirmButtonText: "GO",
				showCancelButton: false,
				closeOnConfirm: false,
				closeOnCancel: false
			}, function(isConfirm) {   //confirm error then come back 
				if (isConfirm) {
					$(location).attr('href', 'm-search.html');
				}
			});
		} else {
			if (ret.status != 0) {
				swal({
					title: "checked application",
					text: "this application has been checked, please check the details and try again! About to go to Loan Inquiry and select an application that needs to check?",
					type: "error",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55 !important",
					confirmButtonText: "GO",
					showCancelButton: false,
					closeOnConfirm: false,
					closeOnCancel: false
				}, function(isConfirm) {
					if (isConfirm) {     //confirm repeat operation then come back
						$(location).attr('href', 'm-search.html');
					}
				});
			} else {
				
				//else then render the data search from database
				toastr.success("sucess!");
				RECORD = ret;
				
				//set the corresponding value
				$("#loanID").val(RECORD.loanID);
				$("#userid").val(RECORD.userID);
				$("#loantype").val(RECORD.loanType);
				$("#amount").val(RECORD.amount);
				$("#month").val(RECORD.month);
				$("#status").val(RECORD.status);
				$("#rate").val(RECORD.rate);
				$("#bankname").val(RECORD.bankname);
				$("#loantime").val(RECORD.loantime);
	
				
				//expand the table
				if ($("#CollapseDetails").children().eq(0).hasClass("fa-plus")) {
					$("#CollapseDetails").click();
				}
				
				//convert the datatype 
				loanid=JSON.stringify(RECORD.loanID);
				
			}
		}
	},"JSON"
	)	     		                 
	      },"JSON"
	 )	
	 

	
	
	//click btn and update, choose different servlet
	$.fn.confirm = function(para) {
		swal({
			title: "please check!",
			text: "you are now doing the check operation, you will check loabID:" + loanid + "的订单进行操作！\nLoanType" + (para == 1 ? "pass" : "reject") + "\nConfirm?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55 !important",
			confirmButtonText: "confirm",
			cancelButtonText: "back",
			closeOnConfirm: false,
		}, function(isConfirm) {
			if (isConfirm) {
				
				toastr.warning("confirm your check results");
            //pass
           if(para==1){	           
	           $.post("ManagerServlet",  //call the passloan function
				{
					"method": "PassLoan",
					"loanID": loanid
				}, 
				function(ret) {					
						swal({
							title: "check finish!",
							text: "this record has been checked, about to the loan-detail page to check records!",
							type: "success",
							showCancelButton: false,
							confirmButtonColor: "#DD6B55 !important",
							confirmButtonText: "GO",
							closeOnConfirm: false,
							closeOnCancel: false
						}, function(isConfirm) {
							
							//confirm then come back to the search page 
							if (isConfirm) {
								$(location).attr('href', 'm-search.html');
							}
						});
				  		
			});
		   }
		   //reject
           if(para==2) {
	           
	           $.post("ManagerServlet",   //call the rejectloan function
				{
					"method": "RejectLoan",
					"loanID": loanid
				}, 
				function(ret) {
						swal({
							title: "check finish!",
							text: "this record has been checked, about to the loan-detail page to check records!",
							type: "success",
							showCancelButton: false,
							confirmButtonColor: "#DD6B55 !important",
							confirmButtonText: "GO",
							closeOnConfirm: false,
							closeOnCancel: false
						}, function(isConfirm) {
							//confirm then come back to the search page 
							if (isConfirm) {
								$(location).attr('href', 'm-search.html');
							}
						});				 		
			});
            }
            }		
	});
    }


	
	
	//pass
	$("#Agree").click(function() {

		$(this).parent().children().children().children().eq(0).removeAttr("style");
		$().confirm(1);
	});
	
	//reject
	$("#Reject").click(function() {
		$(this).parent().children().children().children().eq(0).removeAttr("style");
		$().confirm(2);
	});

});
