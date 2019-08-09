/* global bootbox */
$(document).ready(function () {
    // Getting a reference to the article container we will be rendering all articles inside of
    var articleContainer = $(".article-container");
    // Adding event listeners for dynamically generated buttons for deleting articles,
    // pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {
        // Empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {
            // If we have headlines, render them to the page
            if (data && data.length) {
                renderArticles(data);
            } else {
                // Otherwise render a message explaining we have no articles
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
 
        var articlePanels = [];
      
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
      
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-danger delete'>",
                "Delete From Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));

      
        panel.data("_id", article._id);

        return panel;
    }

    function renderEmpty() {
      
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>Would You Like to Browse Available Articles?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
   
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
       
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
       
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
           e
            for (var i = 0; i < data.notes.length; i++) {
              
                currentNote = $([
                    "<li class='list-group-item notes'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
               
                currentNote.children("button").data("_id", data.notes[i]._id);
               
                notesToRender.push(currentNote);
            }
        }
       
        (".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
      
        var articleToDelete = $(this).parents(".panel").data();
      
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function (data) {
           
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
     
        var currentArticle = $(this).parents(".panel").data();
     
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
           
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-sucess save'>Save Note</button>",
                "<div>"
            ].join("");
          
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
           
            $(".btn-save").data("article", noteData);
           
            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
      
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
      
        
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
              
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
      
        var noteToDelete = $(this).data("_id");
       
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
          
            bootbox.hideAll();
        });
    }
});