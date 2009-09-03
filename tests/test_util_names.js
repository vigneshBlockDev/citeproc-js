/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
dojo.provide("tests.test_util_names");

var display_names = [
	{ "family":"Doe",
	  "given":"John"
	},
	{ "given":"Gwen",
	  "family":"Roe"
	},
	{ "given":"Tom",
	  "family":"Smith"
	}
];

var sys = new RhinoTest();
var state = CSL.makeStyle(sys,"<style></style>");

//
// Delimiters and formatting decorations are
// controlled by cloned tokens derived from
// the token list that expresses the style.
// The nesting structure is considerably more
// complex than the visual appearance of CSL,
// in order to give effect, through nesting and
// simple joins, to the various CSL inter-element
// splice parameters.
// This test shows which of these clone tokens
// do what in the formatting of names.
//

// the "name" token here carries only
// the "and" token carries all the formatting
// decorations of the compiler "name" element.
// its delimiter is either that of the "name"
// element or, if the @and attribute is set
// on it, the string appropriate to its value.
var name = new CSL.Factory.Token("name");
name.strings.delimiter = "and";
name.strings.prefix ="[";
name.strings.suffix ="]";
name.strings["invert-name"] = "first";
state.output.addToken("name",false,name);

// the delimiter value of the "name" element
// from the compiler's token list.  the formatting
// decorations and affixes are copied to
// the "and" token.
var inner = new CSL.Factory.Token("inner");
//inner.strings.prefix ="<";
//inner.strings.suffix =">";
inner.strings.delimiter = ", ";
state.output.addToken("inner",false,inner);

// the sort-separator token carries the
// value of the "name" element @sort-separator
// attribute as its delimiter.  it is otherwise
// empty.
var sortsep = new CSL.Factory.Token("sortsep");
sortsep.strings.delimiter = ", ";
state.output.addToken("sortsep",false,sortsep);

// the invert-name param from the
// name element is set on an otherwise
// empty token for "start", "middle" and
// "end", as appropriate to its value.
var start = new CSL.Factory.Token("start");
state.output.addToken("start",false,start);

var middle = new CSL.Factory.Token("middle");
state.output.addToken("middle",false,middle);

var end = new CSL.Factory.Token("end");
state.output.addToken("end",false,end);

// token params of the optional "family",
// "given", "prefix" and "articular" elements
//  token params are taken from the token
// list, with no changes
var primary = new CSL.Factory.Token("family");
primary.strings.prefix="(";
primary.strings.suffix=")";
state.output.addToken("family",false,primary);

var secondary = new CSL.Factory.Token("given");
state.output.addToken("given",false,secondary);

//
// This should be changed to "articular" in the code
var suffix = new CSL.Factory.Token("suffix");
state.output.addToken("suffix",false,suffix);

var prefix = new CSL.Factory.Token("prefix");
state.output.addToken("prefix",false,prefix);

// the "empty" and "space" tokens are standard
// pre-defined tokens that provide standard
// delimiters without other formatting.
var empty = new CSL.Factory.Token("empty");
state.output.addToken("empty",false,empty);

var space = new CSL.Factory.Token("space");
space.strings.delimiter = " ";
state.output.addToken("space",false,space);

state.tmp.disambig_settings["givens"] = [[[1],[1],[1]]];
state.tmp["initialize-with"] = ".";

state.tmp.nameset_counter = 0;

doh.register("tests.util_names", [
	function testBuildNames (){
		CSL.Util.Names.outputNames(state,display_names);
		doh.assertEqual("[(Doe), J., G. (Roe), and T. (Smith)]", state.output.string(state,state.output.queue));
	}
]);
