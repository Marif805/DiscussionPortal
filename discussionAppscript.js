var submitQuestionNode = document.getElementById("submitBtn");
var questionTitleNode = document.getElementById("subject");
var questionDiscriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode = document.getElementById("resolveHolder");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");
var resolveQuestionNode = document.getElementById("resolveQuestion");


var rightContainerNode = document.getElementById("rightContainer");
var reveiwContainerNode = document.getElementById("reveiwContainer");

//step 8 (i)-> searching for question, listen to value change
questionSearchNode.addEventListener("change",function(event){
      //show filtered value
      filterResult(event.target.value);
});


//step 8 (ii)
function filterResult(query){
      var allQuestions = getAllQuestions();
      if(query)
      {
           clearQuestionPanal();
           var filteredQuestions = allQuestions.filter(function (question){
              if(question.title.includes(query)){
                return true;
              }
           });
          if(filteredQuestions.length){
            filteredQuestions.forEach(function(question){
              addQuestiontoPanal(question);
            })
         }else{
            printNoMatchFound();
         }
          // task 1(minimising reusable code): filteringWithCharacter(allQuestions,query);
    }else{
        //task1 : noCharacterMatch(allQuestions);
           clearQuestionPanal();
           allQuestions.forEach(function(question){
              addQuestiontoPanal(question);
           })
      }
}
//task 1 ->
// function filteringWithCharacter(allQuestions,query){
//           clearQuestionPanal();
//           allQuestions.forEach(function(question){
//               if(question.title.includes(query))
//               {
//                  addQuestiontoPanal(question);
//               }
//           });
// }
// function noCharacterMatch(allQuestions){
//          clearQuestionPanal();
//          allQuestions.forEach(function(question){
//                addQuestiontoPanal(question);
//          });
// }

function clearQuestionPanal(){
    allQuestionsListNode.innerHTML = "";
}



//step 4 -> display all existing question.
function onLoad(){
    //get All the question from storage.
     var allQuestions = getAllQuestions();
     allQuestions.forEach(function(question){
           addQuestiontoPanal(question);
     })

}
onLoad();


//step 1 -> listener on submit button to create the questions.
submitQuestionNode.addEventListener("click",onQuestionSubmit);

function onQuestionSubmit(){
        var question = {
            title : questionTitleNode.value,
            description : questionDiscriptionNode.value,
            responses: [],
            upvotes:0,
            downvotes:0,
            createdAT:Date.now()
        }
    //  console.log(question);
      saveQuestion(question);
      addQuestiontoPanal(question);
      questionTitleNode.value="";
      questionDiscriptionNode.value="";
}


//step 2 -> save the question to localStorage before appending to the left addQuestiontoPanal
function saveQuestion(question){
        // pahile hme localStorage ke andr jo bhi data h usse nikalna h becs localStorage ke
        // andr data ie Array of object present h in the Form string or hme multiple question store krne h localStorage
        // me to hm aese hi nhi store kr skte h (ie localStorage.setItem("question",JSON.stringify(question))) besc
        // aesa krne se previous data(ie question) wo override ho gynge isilye pahile hme localStorage se
        //data ko nikalna h  or fir usko array ke form me lana h then new question uske ander append krna h or fir
        // usko again localStorage ke andr store krna h.
         var allQuestions = getAllQuestions();
         allQuestions.push(question);
         localStorage.setItem("questions",JSON.stringify(allQuestions));
}


//step 4(ii)-> get all question from storage
function getAllQuestions(){
         let allQuestions = localStorage.getItem("questions");
         //console.log(allQuestions);
         if(allQuestions){
                 allQuestions = JSON.parse(allQuestions);
         }
         else{
                 allQuestions = [];
         }

         return allQuestions;
}


//step 3 -> append the question on the left Panel.
function addQuestiontoPanal(question){
          //console.log(question);
          var questionContainer = document.createElement("div");
          questionContainer.setAttribute("id", question.title);
          questionContainer.style.background = "#FFFBE9";

         var newQuestionTitleNode = document.createElement("h4");
          newQuestionTitleNode.innerHTML = question.title;
          questionContainer.appendChild(newQuestionTitleNode);

          var newQuestionDiscriptionNode = document.createElement("p");
          newQuestionDiscriptionNode.innerHTML = question.description;
          questionContainer.appendChild(newQuestionDiscriptionNode);

          var upvoteTextNode = document.createElement("h4");
          upvoteTextNode.innerHTML = "upvote = "+ question.upvotes;
          questionContainer.appendChild(upvoteTextNode);

          var downvoteTextNode = document.createElement("h4");
          downvoteTextNode.innerHTML = "downvote = "+ question.downvotes;
          questionContainer.appendChild(downvoteTextNode);

          var creatingDateTimeNode = document.createElement("h3");
          creatingDateTimeNode.innerHTML = new Date(question.createdAT).toLocaleString();
          questionContainer.appendChild(creatingDateTimeNode);

          allQuestionsListNode.appendChild(questionContainer);

          questionContainer.addEventListener("click", onQuestionClick(question) )
}


//step 5 -> listen for the click on question and display it on the right pane .
function  onQuestionClick( question) {
          return function(){
                //due to clouser scope we  can access question variable.
                // hide question panel.
                hideQuestionPanal();
                // clear last detail.
                clearQuestionDetails();
                clearResponsePanal();
                //show clicked question.
                 showDetails();

                 //step 5(iv) -> create question detail.
                 addQuestionToRight(question);

                 //SHOW ALL PREVIOUS responses
                 question.responses.forEach(function(response){
                      addResponseInPanal(response);
                 })

                 //step 6(i) -> listen for the response submit (comment btn).
                 //submitCommentNode.addEventListener("click",onResponeSubmit(question));
                  submitCommentNode.onclick =  onResponseSubmit(question);

                  //step 8 -> listener on upvote and downvote btn.
                  upvote.onclick = upvoteQuestion(question);
                  downvote.onclick = downvoteQuestion(question);

                  //step 9 -> listener on resolve btn.
                  resolveQuestionNode.onclick = resolveQuestionFunction(event,question);
          }
}



function upvoteQuestion(question){
          return function(){ //it is a higher order function which will execute only when the button will actually clicked.
                   question.upvotes++;
                   updateQuestion(question);
                   updateQuestionUI(question);
          }
}



function downvoteQuestion(question){
           return function(){
                  question.downvotes++;
                  updateQuestion(question);
                  updateQuestionUI(question);
           }
}


// update question in real time when upvote button is pressed.
function updateQuestionUI(question){
            //get question from dom .
            var questionContainerNode = document.getElementById(question.title);
            questionContainerNode.childNodes[2].innerHTML = "upvote = "+question.upvotes;
            questionContainerNode.childNodes[3].innerHTML = "downvote = "+question.downvotes;
}


//listener on resolve btn.
function resolveQuestionFunction(event,question){
           return function(){
                    // console.log(event.target.parentNode);
                    var parent = event.target.parentNode;
                    var child = event.target;
                   //console.log(event.target);
                    var allQuestions = getAllQuestions();
                //  console.log(allQuestions);
                   for(var i=0 ; i<allQuestions.length;i++){
                      if( allQuestions[i].title  === question.title )
                       {
                            allQuestions.splice(i,1);
                            //console.log(allQuestions);
                       }
                  }
                  localStorage.setItem("questions",JSON.stringify(allQuestions));
                  parent.removeChild(child);
                  // rightContainer.style.display = "none";
                  createQuestionFormNode.style.display = "block";
                  //createQuestionFormNode.innerHTML = "";
                //  rightContainer.style.display = "none";

                reveiwContainerNode.style.display ="none";
           }
}


//step 6 -> listen for the click on submit response button.
function onResponseSubmit(question){
        return function(){

             var response = {
                  name: commentatorNameNode.value,
                  description: commentNode.value
             }
             saveResponse(question,response);
             addResponseInPanal(response);
             commentatorNameNode.value = "";
             commentNode.value = "";
        }

}


//step 7 -> displaying response in response section.
function addResponseInPanal(response){
        var userNameNode =  document.createElement("h4");
        userNameNode.innerHTML = response.name;

        var userCommentNode = document.createElement("p");
        userCommentNode.innerHTML = response.description;

        var container = document.createElement("div");
        container.appendChild(userNameNode);
        container.appendChild(userCommentNode);
        responseContainerNode.appendChild(container);
}


//step 5(ii)-> hide question panal.
function hideQuestionPanal(){
      // createQuestionFormNode.innerHTML = "";
      // or
      createQuestionFormNode.style.display = "none";
}


//step 5(iii) -> display questionDetaquestion
function showDetails(){
        questionDetailContainerNode.style.display = "block";
        resolveQuestionContainerNode.style.display = "block";
        responseContainerNode.style.display = "block";
        commentContainerNode.style.display = "block";
        reveiwContainerNode.style.display ="block";
}


//step 5(iv) -> show question detail.
function addQuestionToRight(question){
   var titleNode = document.createElement("h3");
   titleNode.innerHTML = question.title;

   var descriptionNode = document.createElement("p");
   descriptionNode.innerHTML = question.description;

   questionDetailContainerNode.appendChild(titleNode);
   questionDetailContainerNode.appendChild(descriptionNode);
}


function updateQuestion(updatedQuestion){
    var allQuestions = getAllQuestions();
    var revisedQuestions = allQuestions.map(function(question){
            if(updatedQuestion.title === question.title){
                 return updatedQuestion;
            }
        //  console.log(question);
          return question;
   })
  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}


//step 6(iii)
function saveResponse(updatedQuestion){
        var allQuestions = getAllQuestions();
        var revisedQuestions = allQuestions.map(function(question){
                if(updatedQuestion.title === question.title){
                     question.responses.push({
                          name: commentatorNameNode.value,
                          description: commentNode.value
                     })
                }
              //  console.log(question);
                return question;
        })
        localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}


function clearQuestionDetails(){
        questionDetailContainerNode.innerHTML="";
}


function clearResponsePanal() {
        responseContainerNode.innerHTML = "";
}



function printNoMatchFound(){
        var title = document.createElement("h3");
        title.innerHTML = "No match found";

        allQuestionsListNode.appendChild(title);
}
