// Parse an exam (make sense of data from PDF conversion)

var q = 1;
var cluster = "Hospitality";

var exam = {}

var file = cluster + "_" + q + "_Whole";

for (var i = 1; i < 101; i++) {
    exam[i] = {};
    exam[i].q = "";
    exam[i].a = "";
    exam[i].b = "";
    exam[i].c = "";
    exam[i].d = "";
    exam[i].ans = "";
}

var txtfilelocation = '/Users/ibrahimirfan/Desktop/scratch/exams/' + cluster + '/' + file + '.txt';
var jsonfilelocation = '/Users/ibrahimirfan/Desktop/scratch/exams/' + cluster + '/' + file + '.json';

var fs = require('fs');
fs.readFile(txtfilelocation, 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    var data_split = data.split(" ");

    function parse(start, end, end2, end3, end4, idx) {
        var obj = "";
        var skip_count = -1;
        for (var j = 0; j < data_split.length; j++) { // for every word
            var endofstart = "";
            for (var k = data_split[j].length - start.length; k < data_split[j].length; k++) { // for every letter at the end of word
                endofstart += data_split[j][k];
            }
            if (endofstart == start) { // found question start
                skip_count++;
                if (skip_count == idx) {
                    var endofobj = true;
                    for (var k = (j + 1); endofobj; k++) { // for every word in question
                        var wordend = "";
                        for (var l = end.length; l > 0; l--) {
                            wordend += data_split[k][data_split[k].length - l];
                        }

                        var wordend2 = "";
                        for (var l = end2.length; l > 0; l--) {
                            wordend2 += data_split[k][data_split[k].length - l];
                        }

                        var wordend3 = "";
                        for (var l = end3.length; l > 0; l--) {
                            wordend3 += data_split[k][data_split[k].length - l];
                        }

                        var wordend4 = "";
                        for (var l = end4.length; l > 0; l--) {
                            wordend4 += data_split[k][data_split[k].length - l];
                        }

                        if (wordend == end) {
                            obj += data_split[k].substr(0, data_split[k].length - end.length - 1);
                            endofobj = false; // question end
                        } else if (wordend2 == end2) {
                            obj += data_split[k].substr(0, data_split[k].length - end2.length - 1);
                            endofobj = false; // question end
                        } else if (wordend3 == end3) {
                            obj += data_split[k].substr(0, data_split[k].length - end3.length - 1);
                            endofobj = false; // question end
                        } else if (wordend4 == end4) {
                            obj += data_split[k].substr(0, data_split[k].length - end4.length - 1);
                            endofobj = false; // question end
                        } else {
                            obj += data_split[k] + " ";
                        };
                    }
                    return obj;
                }
            }
        }
    } // end of parse()

    function parse_ans(start, idx) {
        var skip_count = -1;
        for (var j = 0; j < data_split.length; j++) { // for every word
            var endofstart = "";
            for (var k = data_split[j].length - start.length; k < data_split[j].length; k++) { // for every letter at the end of word
                endofstart += data_split[j][k];
            }
            if (endofstart == start) { // found answer start
                skip_count++;
                if (skip_count == idx) {
                    //  console.log(data_split[j]);
                    return data_split[j + 1][0];
                }
            }
        }
    } // end of parse_ans()

    function parse_exp(obj, idx) {
        var exp = "";
        var start = obj;
        if (obj == "A") {
            start += exam[idx].a;
        } else if (obj == "B") {
            start += exam[idx].b;
        } else if (obj == "C") {
            start += exam[idx].c;
        } else if (obj == "D") {
            start += exam[idx].d;
        }
        var start2 = start + ".";

        var start_split = start.split(" ");
        var start2_split = start2.split(" ");

        if (start_split.length == 1) {
            var message = start_split[0][0] + "\n";
            for (var i = 1; i < start_split[0].length; i++) {
                message += start_split[0][i];
            }
            for (var j = 0; j < data_split.length; j++) { // for every word (start)
                if ((data_split[j].toUpperCase()).includes(message.toUpperCase())) {
                    var not_done = true;
                    for (var k = j + 1; not_done; k++) { // for every word in exp
                        var wordend = "";
                        for (var m = 7; m > 0; m--) {
                            wordend += data_split[k][data_split[k].length - m];
                        }
                        if (wordend == "SOURCE:") {
                            exp += data_split[k].substr(0, data_split[k].length - 7 - m);
                            not_done = false; // exp end
                        } else {
                            exp += data_split[k] + " ";
                        };
                    }
                    return exp;
                }
            }
        } else {
            for (var j = 0; j < data_split.length; j++) { // for every word (start)
                var correct_count = 0;
                for (var i = 0; i < start2_split.length; i++) { // for every word in message
                    if ((j + i) < data_split.length) {
                        if (data_split[j + i].toUpperCase() == start2_split[i].toUpperCase() && start2_split.length !== 1) { // found matching word
                            correct_count++;
                        }
                        if (i !== 0 && i == start2_split.length - 1 && (data_split[j + i].toUpperCase()).includes(start2_split[i].toUpperCase())) {
                            correct_count++;
                        }
                        if (correct_count == start2_split.length || start2_split.length == 1 && data_split[j + i].toUpperCase() == start2_split[i].toUpperCase()) { // found exp
                            var not_done = true;
                            for (var k = j + start2_split.length; not_done; k++) { // for every word in exp
                                var wordend = "";
                                for (var m = 7; m > 0; m--) {
                                    wordend += data_split[k][data_split[k].length - m];
                                }
                                if (wordend == "SOURCE:") {
                                    exp += data_split[k].substr(0, data_split[k].length - 7 - m);
                                    not_done = false; // exp end
                                } else {
                                    exp += data_split[k] + " ";
                                };
                            }
                            return exp;
                        }
                    }
                }
            }

            var exp = "";
            for (var j = 0; j < data_split.length; j++) { // for every word (start)
                var correct_count = 0;
                for (var i = 0; i < start_split.length; i++) { // for every word in message
                    if ((j + i) < data_split.length) { // doesn't go over
                        if (data_split[j + i].toUpperCase() == start_split[i].toUpperCase() && start_split.length !== 1) { // found matching word
                            correct_count++;
                        }
                        if (i !== 0 && i == start_split.length - 1 && (data_split[j + i].toUpperCase()).includes(start_split[i].toUpperCase())) {
                            correct_count++;
                        }
                        if (correct_count == start_split.length || start_split.length == 1 && data_split[j + i].toUpperCase() == start2_split[i].toUpperCase()) { // found exp
                            var not_done = true;
                            for (var k = j + start_split.length; not_done; k++) { // for every word in exp
                                var wordend = "";
                                for (var m = 7; m > 0; m--) {
                                    wordend += data_split[k][data_split[k].length - m];
                                }
                                if (wordend == "SOURCE:") {
                                    exp += data_split[k].substr(0, data_split[k].length - 7 - m);
                                    not_done = false; // exp end
                                } else {
                                    exp += data_split[k] + " ";
                                };
                            }
                            return exp;
                        }
                    }
                }
            }
        }


    }


    for (var i = 1; i < 100; i++) { // for every question
        exam[i].q = parse(i + ".", "A.", "A.", "A.", "A.", 0);
        exam[i].a = parse("A.", "C.", "B.", "B.", "B.", i - 1);
        exam[i].c = parse("C.", "B.", "D.", "D.", "D.", i - 1);
        exam[i].b = parse("B.", "D.", "C.", "C.", "C.", i - 1);
        exam[i].d = parse("D.", (i + 1) + ".", "Copyright", "2011", "Test", i - 1);

        /*      console.log(i + ". " + exam[i].q);
            console.log("    A. " + exam[i].a);
          console.log("    B. " + exam[i].b);
            console.log("    C. " + exam[i].c);
            console.log("    D. " + exam[i].d); */

        if (i < 10) {
            var skip = 10;
        } else {
            var skip = 1;
        }
        exam[i].ans = parse_ans("\n" + i + ".", 1);

      //     console.log("Correct Answer: " + exam[i].ans);


        exam[i].exp = parse_exp(exam[i].ans, i);

if (exam[i].exp == undefined){
          // console.log(exam[i].exp);
         }
        if (i > 20) {
            exam[100].q = exam[20].q;
            exam[100].a = exam[20].a;
            exam[100].b = exam[20].b;
            exam[100].c = exam[20].c;
            exam[100].d = exam[20].d;
            exam[100].ans = exam[20].ans;
            exam[100].exp = exam[20].exp;
        }

    /*    fs.writeFile(jsonfilelocation, JSON.stringify(exam), function(err, data) {
            if (err) {
                return console.log(err);
            };
            console.log("SAVED");
        }); */
    }

}); // end of readFile
