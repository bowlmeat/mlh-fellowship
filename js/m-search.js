$(document).ready(function() {
	var RECORDS;
	$("#logout").ready(function() {
		//init sidebar
		$(".nav-link").removeClass("active");
		$("#Mys").addClass("active");
	});    
     
     //Return json without passing parameters to get the record
     $.post("Servlet",
            {
	          "method":"selectAllLoans"
            },
            function(ret){
				if (ret != null) {
					console.log(ret);
					RECORDS = ret;
					
					{
		if ($('#MysTable').hasClass('dataTable')) { //Destroy the original dataTables
			dttable = $('#MysTable').dataTable();
			dttable.fnClearTable(); //Empty table
			dttable.fnDestroy(); //estore the initialized datatable
		}
		$('#MysTable').DataTable({
			// Whether to display the processing status
			"processing": true,
			// Adaptive Width
			"bAutoWidth": true,
			//Internationalization
			"oLanguage": oLanguageData,
			"order": [
				    [1, 'asc']
				],
			//Data source
			"data": RECORDS,
			// Control the delayed rendering of DataTables
			"deferRender": true,
			"columnDefs": [{
					"title": "loanID",
					"targets": 0,  //Target Location
					"render": function(data, type, full, meta) {					
						return full.loanID;
					},
				}, 
				{
					"title": "status",
					"targets": 1, //Target Location
					"render": function(data, type, full, meta) {
						if (full.status == 0) {
							return '<span style="color:#17a2b8"><i class="fa fa-spinner fa-spin"></i>unchecked</span>';
						} else if (full.status == 1) {
							return '<span style="color:#28a745"><i class="fa fa-check"></i>passed</span>';
						} else if (full.status == 2) {
							return '<span style="color:#dc3545"><i class="fa fa-remove"></i>rejected</span>';
						} else if (full.status == 3) {
							return '<span style="color:#ffc107"><i class="fa fa-thumbs-up"></i>finished</span>';
						}
					},
				},
				{
					"title": "userID",
					"targets": 2, //Target Location
					"render": function(data, type, full, meta) {
						return full.userID;

					},
				},
				{
					"title": "loanType",
					"targets": 3, //Target Location
					"render": function(data, type, full, meta) {
						return full.loanType;
					},
				},
				{
					"title": "more",
					"targets": 4, //Target Location
					"render": function(data, type, full, meta) {
						let btn;
						if (full.status == 0) {
							btn =
								'<div class="row">' +
								'<div class="col-sm-12 col-md-6 col-lg-6">' +
								'<button type="button" class="btn btn-block btn-sm btn-outline-success" name="judgeThisReport">check</button>' +
								'</div>' +


								'<div class="col-sm-12 col-md-6 col-lg-6">' +
								'<button type="button" class="btn btn-block btn-sm btn-outline-info" name="showThisPeo">detail</button>' +
								'</div>' +
								'</div>'

						} else {
							btn = '<div class="row">' +
								'<div class="col-sm-12 col-md-12 col-lg-12">' +
								'<button type="button" class="btn btn-block btn-sm btn-outline-info" name="showThisPeo">detail</button>' +
								'</div>'
						}
						return btn;


					},
				}
			]


		});

		toastr.success("success!");		
		
	}
					//expand the table
					if ($("#MysCollapse").children().eq(0).hasClass("fa-plus")) {
						$("#MysCollapse").click();
					}
				    } else {
					    swal({
						    title: "error！",
						    text: "Query error! Please contact the admin!",
							showConfirmButton: true,
							showCancelButton: true,
							type: "error",
						}, function(isConfirm) {
							if (isConfirm) {
						}
					});
				}
	        
     }   
     )
     
     
   
     //query all the loan records without input parameters, and return the json

	//Internationalization
	var oLanguageData = {
		"sProcessing": "processing...",
		"sLengthMenu": "render MENU results",
		"sZeroRecords": "no matching results",
		"sInfo": "render NO START to END results，total TOTAL ",
		"sInfoEmpty": "render NO 0 to 0 results，total 0",
		"sInfoFiltered": "( MAX results filter)",
		"sInfoPostFix": "",
		"sSearch": "search:",
		"sUrl": "",
		"pageLength": 5,
		"lengthMenu": [5, 10, 25, 50, 75, 100],
		"sEmptyTable": "empty table",
		"sLoadingRecords": "loading...",
		"sInfoThousands": ",",
		"oPaginate": {
			"sFirst": "first",
			"sPrevious": "previous",
			"sNext": "next",
			"sLast": "last"
		},
		"oAria": {
			"sSortAscending": ": ascendSort",
			"sSortDescending": ": descendSort"
		}
	};


	
	//show
	//render the corresponding info
	$("body").on("click", "button[name=showThisPeo]", function() {
		var loanID = $(this).parent().parent().parent().parent().children().eq(0).html();  //select the records
		
		$.each(RECORDS, function(key, val) {
             //loanID matched then return the info
			if (val.loanID == loanID) {
				$("#loanID").val(val.loanID);
				$("#userid").val(val.userID);
				$("#loantype").val(val.loanType);
				$("#amount").val(val.amount);
				$("#rate").val(val.rate);
				$("#loantime").val(val.loantime);
				$("#repaymoney").val(val.repaymoney);
				$("#ifrepay").val(val.ifrepay);
				$("#month").val(val.month);
				$("#bankname").val(val.bankname);
				$("#status").val(val.status);
				
				//expand and render the table
				$("#MyDetails").removeAttr("style");
				if ($("#MyCollapseDetails").children().eq(0).hasClass("fa-plus")) {
					$("#MyCollapseDetails").click();
				}
				if ($("#MysCollapse").children().eq(0).hasClass("fa-minus")) {
					$("#MysCollapse").click();
				}
				return false;
			}
		});
	});


	//check
	//jump to the check page
	$("body").on("click", "button[name=judgeThisReport]", function() {		
		var loanId = $(this).parent().parent().parent().parent().children().eq(0).html();
						
		//save id
		$.post("SearchServlet",
		      {
			    "method":"store",
			    "sess":loanId			
		      }
	       )	
		
		swal({
			title: "warning",
			text: "About to check the loan records, sure?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55 !important",
			confirmButtonText: "GO",
			cancelButtonText: "Cancel",
			closeOnConfirm: true,
			closeOnCancel: true
			
		}, function(isConfirm) {

			if (isConfirm) {							
				$(location).attr('href', 'm-check.html');
			}
		});
	});
	
});
