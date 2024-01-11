
var list=document.getElementById('list-items');
list.addEventListener('click' ,addOrDeleteElement);
var anonymousId;
window.addEventListener("DOMContentLoaded",()=>{
    axios.get('http://localhost:5000/get-blog')
    .then((res)=> {
        console.log(res)

        for(var i=0; i<res.data.length;i++){
            getCommentsAndShowData(res.data[i]);
        }
    })
    .catch((err) =>{
        console.log(err)
    })
})

function getCommentsAndShowData(myObj){
    axios.get(`http://localhost:5000/get-comments/${myObj.title}`)
    .then((result)=> {
        showData(myObj,result);
    })
    .catch((err)=> console.log(err));
}
function onsignup(){
    var title_=document.getElementById('id1').value;
    var author_=document.getElementById('id2').value;
    var content_=document.getElementById('id3').value;

    let myObj={
        title: title_,
        author: author_,
        content: content_
    };

    axios.post('http://localhost:5000/insert-blog',myObj)
    .then((res)=> console.log(res))
    .catch((err)=> console.log(err)); 

    showData(myObj,null);

}

function showData(obj,result){
    var newList=document.createElement('li');
    var div=document.createElement('div');
    var div1=document.createElement('div');
    div1.className='container';
    var div2=document.createElement('div');
    var h2=document.createElement('h2');
    h2.appendChild(document.createTextNode(obj.title));
    div1.appendChild(h2);
    var expandButton = document.createElement("span");
    expandButton.className = "expand-button";
    expandButton.textContent = "+";
    expandButton.onclick = function () {
      toggleContent(this);
    };
    div1.appendChild(expandButton);
    div.appendChild(div1);
    var h4=document.createElement('h4');
    h4.appendChild(document.createTextNode("Author - "+obj.author));
    div2.appendChild(h4);
    var p=document.createElement('p');
    p.appendChild(document.createTextNode(obj.content));
    div2.appendChild(p);
    var comments=document.createElement('h2');
    comments.appendChild(document.createTextNode("Comments"));
    div2.appendChild(comments);
    var input=document.createElement('input')
    input.type='text';
    input.className='input-container input-box arrow-button'
    div2.appendChild(input);
    var comButton=document.createElement('button');
    comButton.className='comment';
    comButton.appendChild(document.createTextNode('Add Comment'));
    div2.appendChild(comButton);
    var ul=document.createElement('ul');
    ul.className='unorderedList';
    console.log(result)
    if(result){
        for(var i=0; i<result.data.length;i++){
            var li=document.createElement('li');
            li.appendChild(document.createTextNode(result.data[i].content));
            var delButton=document.createElement('button');
            delButton.className='delete';
            delButton.appendChild(document.createTextNode('Delete'));
            li.appendChild(delButton);
            ul.appendChild(li);
        }        
    }
    div2.appendChild(ul);
    div2.style.display="none";
    div.appendChild(div2);
    div.style.backgroundColor = "teal";
    newList.appendChild(div);
    newList.style.padding="5px"
    list.appendChild(newList);
}

function toggleContent(button) {
    var content = button.parentElement.nextSibling;
    console.log(content);
    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "block";
      button.textContent = "-";
    } else {
      content.style.display = "none";
      button.textContent = "+";
    }
  }


function addOrDeleteElement(e){
    if(e.target.classList.contains('comment')){
        var div=e.target.parentElement;
        var title_=div.parentElement.firstChild.firstChild.textContent
        var ul=div.lastChild;
        var li=document.createElement('li');
        li.appendChild(document.createTextNode(div.children[3].value));
        var delButton=document.createElement('button');
        delButton.className='delete';
        delButton.appendChild(document.createTextNode('Delete'));
        li.appendChild(delButton);
        ul.appendChild(li);
        axios.post('http://localhost:5000/insert-comment',{title : title_, content : div.children[3].value})
        .then((res)=> console.log(res))
        .catch((err)=> console.log(err));       
    }
    else if(e.target.classList.contains('delete')){
        if(confirm('Are you sure to delete ?')){
            var li=e.target.parentElement;
            console.log(li.firstChild.textContent)
            var ul=li.parentElement;
            var title_=ul.parentElement.parentElement.firstChild.firstChild.textContent
            ul.removeChild(li);
            axios.post('http://localhost:5000/delete-comment',{title : title_, comment : li.firstChild.textContent})
            .then((res)=> console.log(res))
            .catch((err)=> console.log(err));  
        }
    }
}
