/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact052.js
 * 작성일 : 2021. 05. 24
 * 작성자 : 차진태
 * 설 명 : 상품몰 - 외화다통화(상세)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact052 = function(){
	
	return{
		goMain: function(formObj) {
			msb.util.form.sendForm(formObj, '/untact/untact_index.do?nftfChnlKindCd=MW02809A01');
		},
		goPrdDesc : function() {
			// 상품설명서 및 이용약관
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true);
			hanaJQuery.ajaxSubLoad('/untact/csuntact143.do?index=2', null,function() {
			}, false);
			
		},
		cswGoBack: function() {
			var formObj = document.forms['untact052Form'];
			ibk.csw.untact.common.notFormSubmit("/untact/csuntact050.do");
		},
		pageClose: function() {
			window.history.back();
		},
		setIrt: function(curCd) {
			var frmObj = document.createElement('form');
			msb.util.form.createHiddenField(frmObj, 'cd', "0100109000101");
			msb.util.form.createHiddenField(frmObj, 'cdNm', "외화보통예금");
			msb.util.form.createHiddenField(frmObj, 'inqStrDt', $('#todayYyyyMMdd').val()); // yyyyMMdd
			msb.util.form.createHiddenField(frmObj, 'inqEndDt', $('#todayYyyyMMdd').val());
			msb.util.form.createHiddenField(frmObj, 'curCd3', curCd);
			msb.util.form.createHiddenField(frmObj, 'irtCd', "01001090001013200");
			msb.util.form.createHiddenField(frmObj, 'irtKindCd', "01");
			
			$('#irtApclStrDt1').text('-'); // yyyy.mm.dd
			$('#irtApclEndDt1').text('-');
			$('#irt1').text('-%');
			$('#irtApclStrDt2').text('-');
			$('#irtApclEndDt2').text('-');
			$('#irt2').text('-%');
			
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, false, null);
			hanaJQuery.ajaxSubmit('/untact/csuntact053.do', frmObj, function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				
				var irt1Info = null; 
				var irt2Info = null;
				
				var irtInfos = data['contMap']['BIZ.PFP0022.OUT.REC'];
				
				for(var i = 0; i < irtInfos.length; i++) {
					var desc = irtInfos[i].irtDesc;
					if(desc === "거주자") {
						irt1Info = irtInfos[i];
					}
					else if(desc === "비거주자") {
						irt2Info = irtInfos[i];
					}
				}
				
				var irt1 = Number(irt1Info.irt).toFixed(4); // 거주자 금리
				var irt2 = Number(irt2Info.irt).toFixed(4); // 비거주자 금리
				var irtStrDt1 = irt1Info.irtApclStrDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtEndDt1 = irt1Info.irtApclEndDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtStrDt2 = irt2Info.irtApclStrDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtEndDt2 = irt2Info.irtApclEndDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				/* 전문변경되면 적용
				var irtStrDt1 = irt1Info.irtTrmStrRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtEndDt1 = irt1Info.irtTrmEndRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtStrDt2 = irt2Info.irtTrmStrRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtEndDt2 = irt2Info.irtTrmEndRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				*/
				
				$('#irtApclStrDt1').text(irtStrDt1); // yyyy.mm.dd
				$('#irtApclEndDt1').text(irtEndDt1);
				$('#irt1').text(irt1 + '%');
				$('#irtApclStrDt2').text(irtStrDt2);
				$('#irtApclEndDt2').text(irtEndDt2);
				$('#irt2').text(irt2 + '%');
				
			});
		},
		dummy: null
	};
	
}();
//# sourceURL=ibk-csw-untact-untact052.js