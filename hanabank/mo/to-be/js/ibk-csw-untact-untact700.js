/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact100.js
 * 작성일 : 2021. 03. 02
 * 작성자 : 김이준
 * 설 명 : 비대면 실명확인 - 자격검증 - 개인정보입력 (실명인증)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact700 = function(){
	
	return{
		/* 상세 이동*/
		detailSubmit : function(apcNo ,guBunCd){
			
			var hanaJQuery = new HanaJQuery("detailPage", true);
			var formObj = msb.util.form.createForm();
			msb.util.form.createHiddenField(formObj, 'apcNo', apcNo);
			if(guBunCd == "1"){
				hanaJQuery.ajaxLoad("/untact/csuntact701.do", formObj,function(){
					layerOpen.init('#layerpopup01');
				}, false);
			}else if(guBunCd == "2"){
				hanaJQuery.ajaxLoad("/untact/csuntact702.do", formObj,function(){
					layerOpen.init('#layerpopup01');
				}, false);
			}
			
			
		},
		delSubmit : function(apcNo,pageCode){
			
			var formObj = msb.util.form.createForm();
			msb.util.form.createHiddenField(formObj, 'paramApcNo', apcNo);
			msb.util.form.createHiddenField(formObj, 'pageCode', pageCode);
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact132.do", formObj, function(resultData,status){
				var data = jQuery.parseJSON(resultData.responseText);
				if(data.result == "1"){
					var formObj = msb.util.form.createForm();
					ibk.csw.untact.common.notFormSubmit("/untact/csuntact700.do",formObj);
				}
			});
			
			
//			hanaDialog.openConfirm({title:"알림", message:"신청을 취소하시겠습니까?", fCallback1:function(){
//				var formObj = msb.util.form.createForm();
//				msb.util.form.createHiddenField(formObj, 'paramApcNo', apcNo);
//				msb.util.form.createHiddenField(formObj, 'pageCode', pageCode);
//				var hanaJQuery = new HanaJQuery(null, true);
//				hanaJQuery.ajaxSubmit("/untact/csuntact132.do", formObj, function(resultData,status){
//					var data = jQuery.parseJSON(resultData.responseText);
//					if(data.result == "1"){
//						var formObj = msb.util.form.createForm();
//						ibk.csw.untact.common.notFormSubmit("/untact/csuntact700.do",formObj);
//					}
//				});
//			} , fCallback2:function(){
//				
//			}});
			
			
		},
		followingSubmit: function(apcNo,option){
			
			var formObj = msb.util.form.createForm();
			if("H" == option){
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
				ibk.csw.untact.common.notFormSubmit(url,formObj);	
			});
		},
		openPopupSubmit: function(code){
			var hanaJQuery = new HanaJQuery("detailPage", true);
			var formObj = document.forms['untact701Form'];
			msb.util.form.createHiddenField(formObj, 'proNmCd', code);
			/*DMPY_ACCT_NO : 요구불 계좌번호  FRC_DMPY_ACCT_NO : 외화 요구불 계좌번호*/
			/*PROC_CPLT_DT4 : 전자금융 완료일 PROC_CPLT_DT23 : 외화상품 완료일 PROC_CPLT_DT1: 입출금 처리완료일*/
			/* ACCT_MGNT_BR_NM : 관리점명*/
			
			hanaJQuery.ajaxLoad("/untact/csuntact703.do", formObj,function(){
				
				if("1" == code || "2" == code){
					layerOpen.init('#layerpopup02');
				}else if("3" == code){
					layerOpen.init('#layerpopup03');
				}else if("4" == code){
					layerOpen.init('#layerpopup04');
				}
			}, false);
			
			
		},
		newProdSubmit: function(){
//			var sendForms = $('<form></form>');
//			sendForms.attr("action","/untact/csuntact050.do");
//			sendForms.attr("method","post");
//			sendForms.appendTo('body');
//			sendForms.submit();
			ibk.csw.untact.common.notFormSubmit("/untact/csuntact050.do");
			
			
		},reShootSubmit: function(){
			ibk.csw.untact.common.notFormSubmit("/untact/csuntact800.do");
		},goHome: function(){
			if(oPLATFORM.ANDROID()) {
				ibk.csw.common.fnAppFinish(null);
			} else {
				location.href = "native://exit";
			}
		},goIndex:function(){
			ibk.csw.untact.common.notFormSubmit("/untact/untact_index.do?nftfChnlKindCd=MW02809A01");
		},
		
		//기업앱-보안센터-모바일신청확인 이동
		mOtpUrlSubmit : function(){
			var mOtpUrl = "cont/adm/oneqbiz_bridge4.jsp?url=/reform/indiv/motp/msbCpbMotp006_01.do?pageGubn=L";
			if(SERVER_SECTION == "dev"){
				
				if(oPLATFORM.ANDROID()){
					window.open("https://dev11-mcbs.kebhana.com:18280/" + mOtpUrl);
				}else{
					window.location.href= "https://dev11-mcbs.kebhana.com:18280/" + mOtpUrl;
				}
				
			}else if(SERVER_SECTION == "stg"){
				
				if(oPLATFORM.ANDROID()){
					window.open("https://stg11-mcbs.kebhana.com:18280/" + mOtpUrl);
				}else{
					window.location.href= "https://stg11-mcbs.kebhana.com:18280/" + mOtpUrl;
									}
			}else{
				
				if(oPLATFORM.ANDROID()){
					window.open("https://mcbs.kebhana.com/" + mOtpUrl);
				}else{
					window.location.href= "https://mcbs.kebhana.com/" + mOtpUrl;
				}
				
			}
		}
		
		
		
	};
	
}();

//# sourceURL=ibk-csw-untact-untact100.js