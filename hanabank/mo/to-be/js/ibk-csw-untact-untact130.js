
ibk.csw.untact.untact130 = function(){
	
	return{
		delSubmit : function(apcNo,pageCode){
			var formObj = msb.util.form.createForm();
			msb.util.form.createHiddenField(formObj, 'paramApcNo', apcNo);
			msb.util.form.createHiddenField(formObj, 'pageCode', pageCode);
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact132.do", formObj, function(resultData,status){
				layerOpen.init('#layerpopup04');
			});
		},
		followingSubmit: function(apcNo,option){
			if("H" == option && $("#extgNewCustDvCd").val() == "2"){
				layerOpen.init('#layerpopup05'); // 나이스 팝업 오픈 
				return false;
			}
			var formObj = msb.util.form.createForm();
			if("" != $("#dpPrdApcYn").val()){
				$("#dpPrdApcYn").val("Y");
			}
			if("" != $("#frcDpPrdApcYn").val()){
				$("#frcDpPrdApcYn").val("Y");
			}
			if("" != $("#elecFncApcYn").val()){
				$("#elecFncApcYn").val("Y");
			}
			
			msb.util.form.createHiddenField(formObj, 'paramApcNo', apcNo);
			msb.util.form.createHiddenField(formObj, 'dpPrdApcYn', $("#dpPrdApcYn").val());
			msb.util.form.createHiddenField(formObj, 'frcDpPrdApcYn', $("#frcDpPrdApcYn").val());
			msb.util.form.createHiddenField(formObj, 'elecFncApcYn', $("#elecFncApcYn").val());
			msb.util.form.createHiddenField(formObj, 'niceYn', option);
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact131.do", formObj, function(resultData,status){
				var data = jQuery.parseJSON(resultData.responseText);
				var url = "/untact/"+data.nextPageCd+".do";
				ibk.csw.untact.untact130.goUrl(apcNo,url);
			});
		},
		goNewProdSubmit : function(formObj){
			var counts = $("#counts").val();
			if(counts > 0){
				hanaDialog.openAlert({title:"알림", message:'진행중인 상품이 있습니다.\n 다시 신청하시려면 신청취소를 선택하시고,\n다른 상품 가입 버튼을 눌러주세요.'});
				
				return false;
			}else{
				var hanaJQuery = new HanaJQuery(null, true);
				hanaJQuery.ajaxSubmit("/untact/csuntact121.do", formObj, function(resultData,status){
					var data = jQuery.parseJSON(resultData.responseText);
					if("N" == data.nextPageUrl){
						var massge = "법인 대표자 고객확인 화면으로 이동합니다. 대표자 고객확인 완료 후 하나원큐 기업앱에서 다시 진행해 주시기 바랍니다.";
						hanaDialog.openAlert({title:"알림", message:massge, fCallback1:function(){	
							ibk.csw.untact.common.notFormSubmit("https://dev11-m.kebhana.com:18680/untact/untact_index.do?nftfChnlKindCd=MW02807A01");
		        		}});
						
					}else{
						var Url =  '/untact/'+data.nextPageUrl+'.do';
						msb.util.form.sendForm(formObj,Url);
					}
				});
			}
		},
		cancelClick : function(){
			var formObj = document.forms['untact130Form'];
			msb.util.form.sendForm(formObj, "/untact/csuntact130.do");
			
		},goUrl : function(apcNo, url){
			var formObj = document.forms['untact130Form'];
			$("#paramApcNo").val(apcNo);
			msb.util.form.sendForm(formObj,url);
		}
		
	};
	
}();