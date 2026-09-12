(function ($) {
    "use strict";

    var currentPage = null;

    var routes = {
        home: 'src/pages/home.html',
        layanan: 'src/pages/layanan.html',
        'lab-bahasa': 'src/pages/lab-bahasa.html',
        'tim-upb': 'src/pages/tim-upb.html',
        informasi: 'src/pages/informasi.html',
        kontak: 'src/pages/kontak.html'
    };

    function loadComponents() {
        $.when(
            $('#topbar').load('src/components/topbar.html'),
            $('#navbar').load('src/components/navbar.html'),
            $('#footer').load('src/components/footer.html')
        ).done(function () {
            initRouter();
        });
    }

    function navigate(page) {
        if (page === currentPage) return;
        if (!routes[page]) return;

        currentPage = page;
        history.pushState(null, '', '#' + page);

        $.get(routes[page], function (data) {
            $('#content').html(data);
            updateActiveNav(page);
            reinitPlugins();
        }).fail(function () {
            $('#content').html('<div class="container-fluid p-5 text-center"><h2>Page not found</h2></div>');
        });
    }

    function updateActiveNav(page) {
        $('#navbar .nav-item.nav-link, #navbar .dropdown-item').removeClass('active');
        $('#navbar [data-page="' + page + '"]').addClass('active');

        var $dropdownToggle = $('#navbar [data-page="' + page + '"]').closest('.dropdown').find('.dropdown-toggle');
        if ($dropdownToggle.length) {
            $dropdownToggle.addClass('active');
        }
    }

    function reinitPlugins() {
        if (typeof bootstrap !== 'undefined') {
            var carousels = document.querySelectorAll('.carousel');
            carousels.forEach(function (el) {
                if (!bootstrap.Carousel.getInstance(el)) {
                    new bootstrap.Carousel(el);
                }
            });
        }
    }

    function initRouter() {
        $(document).on('click', '[data-page]', function (e) {
            e.preventDefault();
            var page = $(this).data('page');
            navigate(page);

            var navbarCollapse = $('#navbarCollapse');
            if (navbarCollapse.hasClass('show')) {
                navbarCollapse.collapse('hide');
            }
        });

        $(window).on('popstate', function () {
            var page = location.hash.replace('#', '') || 'home';
            currentPage = null;
            navigate(page);
        });

        var initialPage = location.hash.replace('#', '') || 'home';
        navigate(initialPage);
    }

    $(document).ready(function () {
        loadComponents();
    });

})(jQuery);
