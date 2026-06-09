(function () {
    // Category filter -- runs on blog.html
    var filterBtns = document.querySelectorAll('[data-filter]');
    if (filterBtns.length) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var selected = this.dataset.filter;

                filterBtns.forEach(function (b) {
                    var cat = b.dataset.filter;
                    b.classList.remove('active', 'btn-secondary', 'btn-danger', 'btn-primary', 'btn-info',
                        'btn-outline-secondary', 'btn-outline-danger', 'btn-outline-primary', 'btn-outline-info');
                    if (cat === 'ctf') b.classList.add('btn-outline-danger');
                    else if (cat === 'tutorial') b.classList.add('btn-outline-primary');
                    else if (cat === 'research') b.classList.add('btn-outline-info');
                    else b.classList.add('btn-outline-secondary');
                });

                this.classList.remove('btn-outline-secondary', 'btn-outline-danger', 'btn-outline-primary', 'btn-outline-info');
                this.classList.add('active');
                if (selected === 'ctf') this.classList.add('btn-danger');
                else if (selected === 'tutorial') this.classList.add('btn-primary');
                else if (selected === 'research') this.classList.add('btn-info');
                else this.classList.add('btn-secondary');

                document.querySelectorAll('.blog-card').forEach(function (card) {
                    card.style.display =
                        (selected === 'all' || card.dataset.category === selected) ? '' : 'none';
                });
            });
        });
    }

    // Table of contents -- runs on post pages
    document.addEventListener('DOMContentLoaded', function () {
        var postContent = document.getElementById('post-content');
        var tocList = document.getElementById('toc-list');
        var toc = document.getElementById('toc');

        if (!postContent || !tocList || !toc) return;

        var headings = postContent.querySelectorAll('h2, h3');
        if (headings.length === 0) {
            toc.style.display = 'none';
            return;
        }

        headings.forEach(function (heading) {
            var id = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            heading.id = id;

            var li = document.createElement('li');
            if (heading.tagName === 'H3') li.style.paddingLeft = '1rem';

            var a = document.createElement('a');
            a.href = '#' + id;
            a.textContent = heading.textContent;
            li.appendChild(a);
            tocList.appendChild(li);
        });

        toc.classList.remove('d-none');
    });
}());
