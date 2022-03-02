/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact050.js
 * 작성일 : 2021. 05. 24
 * 작성자 : 차진태
 * 설 명 : 상품몰 - 메인
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact050 = function(){
	
	return{
		goDetail: function(formObj, urlNumber) {
			if(urlNumber === 1) {
				msb.util.form.sendForm(formObj, '/untact/csuntact051.do');
			}
			else if(urlNumber === 2) {
				msb.util.form.sendForm(formObj, '/untact/csuntact052.do');
			}
		},
		goMain: function(formObj) {
			msb.util.form.sendForm(formObj, '/untact/untact_index.do?nftfChnlKindCd=MW02809A01');
		},
		dummy: null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact050.js