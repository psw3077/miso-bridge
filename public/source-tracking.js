(function(){
  var params=new URLSearchParams(window.location.search);
  var sourceCard=params.get('source_card')||'';
  var sourceStaff=params.get('source_staff')||'';
  var ref=document.referrer||'';
  if(!sourceCard&&ref.indexOf('psw3077.github.io')!==-1) sourceCard='miso-card';
  if(!sourceCard) return;
  try{
    sessionStorage.setItem('miso_source_card',sourceCard);
    if(sourceStaff) sessionStorage.setItem('miso_source_staff',sourceStaff);
  }catch(e){}
  var originalFetch=window.fetch;
  if(!originalFetch) return;
  window.fetch=async function(input,init){
    try{
      var url=typeof input==='string'?input:(input&&input.url)||'';
      var isLead=url.indexOf('/rest/v1/partner_applications')!==-1||url.indexOf('/rest/v1/consulting_inquiries')!==-1;
      if(isLead&&init&&typeof init.body==='string'){
        var body=JSON.parse(init.body);
        var card=sourceCard;
        var staff=sourceStaff;
        try{card=card||sessionStorage.getItem('miso_source_card')||'';staff=staff||sessionStorage.getItem('miso_source_staff')||'';}catch(e){}
        if(card) body.source_card=card;
        if(staff) body.source_staff=staff;
        init=Object.assign({},init,{body:JSON.stringify(body)});
      }
    }catch(e){}
    return originalFetch.call(this,input,init);
  };
})();
