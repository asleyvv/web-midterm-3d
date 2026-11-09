/*
 * jquery-effects.js  (Person C)
 * jQuery features shared by all pages. Every feature checks that its
 * elements exist on the current page, so one file works everywhere.
 *
 *  - initBackToTop()      all pages      fade in/out + smooth scroll
 *  - initFaq()            About.html     accordion + live search
 *  - initEventFilter()    community.html filter events by level
 *  - initGroupCards()     community.html hover effect + jump to event
 */
$(document).ready(function () {
  "use strict";

  // ---------- helpers (reusable functions, one returns a value) ----------

  // Returns "1 game night" / "3 game nights" for the result counter.
  function countLabel(count, singular) {
    return count + " " + singular + (count === 1 ? "" : "s");
  }

  // Opens one FAQ answer and closes the others (uses traversal).
  function openFaqItem($button, $allAnswers) {
    const $item = $button.closest(".accordion-item");        // traversal: closest
    const $answer = $item.find(".accordion-collapse");        // traversal: find
    const isOpen = $answer.is(":visible");

    $allAnswers.not($answer).slideUp(200);                    // effect: slideUp
    $item.siblings().find(".accordion-button")                // traversal: siblings
      .addClass("collapsed").attr("aria-expanded", "false");

    if (isOpen) {
      $answer.slideUp(200);
      $button.addClass("collapsed").attr("aria-expanded", "false");
    } else {
      $answer.slideDown(250);                                 // effect: slideDown
      $button.removeClass("collapsed").attr("aria-expanded", "true");
    }
  }

  // ---------- 1. Back-to-top button (all pages) ----------
  function initBackToTop() {
    const $btn = $("a.back-to-top");                          // selector: element.class
    if (!$btn.length) return;

    $btn.hide();
    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 300) {
        $btn.fadeIn(200);                                     // effect: fadeIn
      } else {
        $btn.fadeOut(200);                                    // effect: fadeOut
      }
    });

    $btn.on("click", function (event) {                       // event: click
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 400);         // effect: animate
    });
  }

  // ---------- 2. FAQ accordion + search (About.html) ----------
  function initFaq() {
    const $list = $("#faqList");                              // selector: ID
    if (!$list.length) return;

    const $buttons = $list.find(".accordion-button");
    const $answers = $list.find(".accordion-collapse");

    // Make the headings real, keyboard-friendly buttons.
    $buttons.attr({ role: "button", tabindex: "0" });
    $answers.not(".show").hide();
    $buttons.each(function () {
      const open = $(this).closest(".accordion-item").find(".accordion-collapse").hasClass("show");
      $(this).toggleClass("collapsed", !open).attr("aria-expanded", open);
    });

    $buttons.on("click", function () {                        // event: click
      openFaqItem($(this), $answers);
    });
    $buttons.on("keydown", function (event) {                 // keyboard support
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFaqItem($(this), $answers);
      }
    });

    // Live search: hides questions that do not match what was typed.
    $("#faq-search").on("input", function () {                // event: input
      const text = $(this).val().trim().toLowerCase();
      let shown = 0;
      $list.children(".accordion-item").each(function () {    // traversal: children
        const match = $(this).text().toLowerCase().indexOf(text) !== -1;
        $(this).toggle(match);                                // effect: toggle
        if (match) shown++;
      });
      $("#faq-empty").prop("hidden", shown !== 0);
    });
  }

  // ---------- 3. Event filter (community.html) ----------
  function initEventFilter() {
    const $buttons = $(".filter-btn");                        // selector: class
    const $rows = $(".event-table tbody tr");                 // selector: descendant
    if (!$buttons.length || !$rows.length) return;

    function applyLevel(level) {
      let shown = 0;
      $rows.each(function () {
        const match = level === "all" || $(this).data("level") === level;
        if (match) { $(this).fadeIn(200); shown++; }          // effect: fadeIn
        else { $(this).fadeOut(150); }                        // effect: fadeOut
      });
      $("#event-count").text(countLabel(shown, "game night"));
      $("#event-empty").prop("hidden", shown !== 0);
    }

    $buttons.on("click", function () {                        // event: click
      const $btn = $(this);
      $btn.addClass("active").attr("aria-pressed", "true")
        .siblings().removeClass("active").attr("aria-pressed", "false");
      applyLevel($btn.data("level"));
    });

    applyLevel("all");
    // Used by initGroupCards: show every row again.
    $(document).on("events:reset", function () {
      $buttons.filter('[data-level="all"]').trigger("click"); // selector: attribute
    });
  }

  // ---------- 4. Group cards (community.html) ----------
  function initGroupCards() {
    const $cards = $(".group-card");
    if (!$cards.length) return;

    // Hover effect: lift the card and mark it.
    $cards.on("mouseenter", function () {                     // event: mouseenter
      $(this).addClass("is-hover");
    }).on("mouseleave", function () {                         // event: mouseleave
      $(this).removeClass("is-hover");
    });

    // The card link scrolls to its event and highlights the row.
    $cards.find("a").on("click", function (event) {           // traversal: find
      const $row = $($(this).attr("href"));
      if (!$row.length) return;
      event.preventDefault();
      $(document).trigger("events:reset");
      $("html, body").animate({ scrollTop: $row.offset().top - 140 }, 400, function () {
        $row.addClass("row-highlight");
        setTimeout(function () { $row.removeClass("row-highlight"); }, 1800);
      });
    });
  }

  // ---------- start: runs when the DOM is ready (DOMContentLoaded) ----------
  initBackToTop();
  initFaq();
  initEventFilter();
  initGroupCards();
});