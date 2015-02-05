$(function () {
  var page_regex = /\/\/zh.moegirl.org\/(([\w%.\-_:]+))/i;
  var support_localstorage = 'object' == typeof window.localStorage;

  $('#moegirl-content').on('replace_link', function () {
    $(this).find('a').each(function () {
      var a = $(this), link = a.prop('href');
      if (page_regex.test(link)) {
        var new_link = './' + page_regex.exec(link)[1];
        a.prop('href', new_link).attr('pjax', 'on');
      }
    });
  }).trigger('replace_link');

  $(document).pjax('a[pjax]', '#moegirl-content', { timeout: 2000 }).on('pjax:success', function () {
    $('#moegirl-content').trigger('replace_link');
    var meta = $('#moegirl-proxy-data').data();
    console.log('Content loaded', meta);

    $('#open-in-mg').prop('href', meta.url);
    $('#page-current').text(meta.title);

    $('#page-Mainpage').parent().toggleClass('active', 'Mainpage' == meta.title);
    
    document.title = meta.title + ' - 萌娘百科 万物皆可萌的百科全书 - by moegirl proxy';

    $(document).data('moegirl-meta', meta).trigger('MoegirlContentLoaded', meta);
  });

  if (support_localstorage) {
    $(document).on('MoegirlSaveSettings', function () {
      window.localStorage['MoegirlProxy'] = JSON.stringify(settings);
    });
    var settings = JSON.parse(window.localStorage['MoegirlProxy'] || '{}');

    // favorite
    var favorite_list = settings.favorites || [];
    $('#favorite').on('click', function () {
      var meta = $(document).data('moegirl-meta');
      if ($(this).hasClass('is-favorite')) {
        favorite_list.splice(favorite_list.indexOf(meta.title));
      } else {
        favorite_list.push(meta.title);
      }
      $(this).toggleClass('is-favorite');
      settings.favorites = favorite_list;

      $(document).trigger('MoegirlSaveSettings');
    }).show();
    $(document).on('MoegirlContentLoaded', function (event, meta) {
      $('#favorite').toggleClass('is-favorite', -1 != favorite_list.indexOf(meta.title))
    });
  }

  if (!$('#moegirl-content').contents('*').length) {
    $.pjax({ url: './MainPage', container: '#moegirl-content' });
  } else {
    $(document).trigger('pjax:success');
  }
});
