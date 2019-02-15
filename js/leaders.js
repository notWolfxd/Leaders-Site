var field_data = {
    gametype: {
        fn: "Gamemode",
        ht: "Which gamemode are you recruiting for?",
        al: "title"
    },
    name: {
        fn: "Team Name",
        ht: "What is your team's name?",
        al: "name"
    },
    abouts: {
        fn: "About",
        ht: "What would you like people to know about your team?",
        al: "abouts"
    },
    reqs: {
        fn: "Requirements",
        ht: "What is required to join your team?",
        al: "reqs"
    },
    link: {
        fn: "Team Link",
        ht: "What is the link to join your team's discord?",
        al: "link"
    }
};

var mm = {
    dark: {
        d: "Light Mode",
        m: "sun"
    },
    light: {
        d: "Dark Mode",
        m: "moon"
    }
};

function updateSyntax() {
    var gametype = $('#gametype-field').val();
    var name = $('#name-field').val();
    var link = $('#link-field').val();
    var abouts = '';
    var reqs = '';
    var bugtext = '';
    for (var i = 1; i <= window.sct; i++) {
        var about = $('#s' + i + '-field').val();
        if (about) {
            abouts = abouts + ' - ' + about;
        }
    }
    for (var i = 1; i <= window.nct; i++) {
        var req = $('#n' + i + '-field').val();
        if (req) {
            reqs = reqs + ' - ' + req;
        }
    }

    if (gametype && link && about && reqs && link) {
        bugtext = '-recruit ' + gametype + ' | ' + name + ' |' + abouts + ' |' + reqs + ' | ' + link;
    }
    $('#syntax').text(bugtext);
    $('#lrg-rep').toggleClass('hidden', bugtext.length < 1400);
}

function addAbout() {
    window.sct++;
    var stxt = '<div class="input-group" id="s' + window.sct + '-grp"><span class="input-group-label">About ' + window.sct + '</span><input type="text" class="input-group-field" id="s' + window.sct + '-field"></div>';
    $('#abouts-fs').append(stxt);
}

function removeAbout(event) {
    if (window.sct > 1) {
        $('#s' + window.sct + '-grp').remove();
        window.sct--;
        if (typeof(event.data) !== 'undefined' && event.data.edit) {
            updateEditSyntax();
        } else {
            updateSyntax();
        }
    }
}
function addReq() {
    window.nct++;
    var ntxt = '<div class="input-group" id="n' + window.nct + '-grp"><span class="input-group-label">Req ' + window.nct + '</span><input type="text" class="input-group-field" id="n' + window.nct + '-field"></div>';
    $('#reqs-fs').append(ntxt);
}

function removeReq(event) {
    if (window.nct > 1) {
        $('#n' + window.nct + '-grp').remove();
        window.nct--;
        if (typeof(event.data) !== 'undefined' && event.data.edit) {
            updateEditSyntax();
        } else {
            updateSyntax();
        }
    }
}

function updateEditSyntax() {
    var edit_id = $('#edit-id').val();
    var edit_type = $('#edit-section').val();
    var edit_val = '';
    var alias = '';
    if (edit_type == 'steps') {
        alias = 'str';
        for (var i = 1; i <= window.sct; i++) {
            var step = $('#s' + i + '-field').val();
            if (step) {
                edit_val = edit_val + ' - ' + step;
            }
        }
        if (edit_val) {
            edit_val = edit_val.substr(1);
        }
    } else {
        edit_val = $('#' + edit_type + '-field').val();
        alias = field_data[edit_type].al;
    }
    var edit_txt = '';
    if (edit_id && edit_val) {
        edit_txt = '!edit ' + edit_id + ' | ' + alias + ' | ' + edit_val;
    }
    $('#edit-syntax').text(edit_txt);
}

function updateField(event) {
    $('#edit-syntax').text('');
    window.sct = 1;
    $('#add-btn').off('click');
    $('#del-btn').off('click');
    switch(event.target.value) {
        case "steps":            
            var steps_html = '<label>Steps to Reproduce</label><p class="help-text" id="steps-help">Write each step others would have to follow to reproduce the bug. Note: Dashes will be added automatically for each step. To add/remove fields, you can use the buttons below</p><div class="callout mbox" id="steps-fs"><div class="button-group small"><button type="button" class="button" id="add-btn"><i class="fas fa-plus"></i> Add</button><button type="button" class="button" id="del-btn"><i class="fas fa-minus"></i> Remove</button></div><div class="input-group" id="s1-grp"><span class="input-group-label">Step 1</span><input type="text" class="input-group-field" id="s1-field" required></div></div>';
            $('#edit-field').html(steps_html);
            $('#add-btn').on('click', addStep);
            $('#del-btn').on('click', {edit: true}, removeStep);
            break;
        default:
            if (event.target.value in field_data) {
                var field_html = '<label for="' + event.target.value + '-field">' + field_data[event.target.value].fn + '</label><p class="help-text" id="' + event.target.value + '-help">' + field_data[event.target.value].ht + '</p><input type="text" id="' + event.target.value + '-field" aria-describedby="' + event.target.value + '-help" required>';
                $('#edit-field').html(field_html);
            }
    }
}

function loadTheme() {
    var light = false;
    if (typeof(Storage) !== 'undefined') {
        light = (localStorage.getItem('light') == 'true');
    }
    return light;
}

function setTheme() {
    if (typeof(Storage) !== 'undefined') {
        var light = false;
        if ($('body').attr('class') == 'light') {
            light = true;
        }
        localStorage.setItem('light', light.toString());
    }
}

function switchMode() {
    var bc = $('body').toggleClass('light')[0].className;
    if (bc == '') {
        bc = 'dark';
    }
    $('#switch-mobile').html('<i class="far fa-' + mm[bc].m + '"></i>');
    $('#switch-desktop').html('<i class="far fa-' + mm[bc].m + '"></i> ' + mm[bc].d);
    setTheme();
}

function pageLoad(page) {
    window.sct = 1;
    window.nct = 1;
    var cb_btn = '';
    var st = '';
    switch (page) {
        case "create":
            $('div#content').on('input', 'input[id*="-field"]', updateSyntax);
            $('#addabout-btn').on('click', addAbout);
            $('#delabout-btn').on('click', removeAbout);
            $('#addreq-btn').on('click', addReq);
            $('#delreq-btn').on('click', removeReq);
            cb_btn = '#copy-btn';
            st = '#syntax';
            break;
        case "edit":
            $('#edit-section').on('change', updateField);
            $('#edit-id').on('input', updateEditSyntax);
            $('div#content').on('input', 'input[id*="-field"]', updateEditSyntax);
            $('#edit-section').change();
            cb_btn = '#edit-copy-btn';
            st = '#edit-syntax';
            break;
    }
    var cb = new ClipboardJS(cb_btn, {
        text: function(trigger) {
            return $(st).text();
        }
    });
    cb.on('success', function(e) {
        $(e.trigger).html('Copied');
        ga('send', 'event', 'syntax', 'copy');
        setTimeout(function() {
            $(e.trigger).html('Copy');
        }, 2000);
    });
    $('body').on('click', 'a[id*="switch-"]', switchMode);
    if (loadTheme()) {
        switchMode();
    }
}
