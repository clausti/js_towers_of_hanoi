(function() {
	var Hanoi = window.Hanoi = window.Hanoi || {};

	var UI = Hanoi.UI = function(game, browserWindow) {
		this.game = game;
		this.browserWindow = browserWindow;
		this.startTower;
		this.endTower;
	};

	UI.prototype.render = function() {
		this.clearGame();

		for(var i = 0; i< this.game.towers.length; i++) {
			var targetTower = $(".tower")[i];
			var gameTower = this.game.towers[i];

			UI.makeDisc(0, targetTower); // make empty row for visuals.
			for(var j = 2; j >= 0; j--) {
				var disc = gameTower[j];
				UI.makeDisc(disc, targetTower);
			}
		}
	};

	UI.prototype.makeMove = function() {
		var startIdx = this.getIndex(this.startTower);
		var endIdx = this.getIndex(this.endTower);
		if (this.game.move(startIdx, endIdx)) {
			$(".marquee").text("");
		} else {
			$(".marquee").text("Invalid move");
		}
	}

	UI.prototype.getIndex = function(tower) {
		var towerId = tower.attr("data-id")
		return parseInt(towerId);
	};

	UI.prototype.resetTowers = function () {
		this.startTower = null;
		this.endTower = null;
	};

	UI.prototype.checkWin = function() {
		if (this.game.isWon()) {
			$(".marquee").text("You Wins!!");
			$('.game').off('click') ;
		}
	};

	UI.prototype.eachClick = function(clickEvent) {
		var block = $(clickEvent.target);
		var workingTower = block.parent();

		if (this.startTower) {
			this.endTower = workingTower;
			this.makeMove();
			this.checkWin();
			this.resetTowers();
			this.render();
		} else {
			this.startTower = workingTower;
			this.highlightStartTower();
		}
	};

	UI.prototype.highlightStartTower = function() {
		this.startTower.children().filter(".block-full").toggleClass("block-highlight");
	}

	UI.addBlock = function(isFull, targetTower) {
		if(isFull) {
			$("<div class='block-full'></div>").appendTo(targetTower)
		} else {
			$("<div class='block'></div>").appendTo(targetTower)
		}
	};

	UI.makeDisc = function(disc, targetTower) {
		var row = [];
		var discVal = disc || 0;
		var padding = (5 - discVal) / 2;

		for (var i = 0; i < 5; i++) {
			if(i < padding || i >= (padding + discVal)) {
				row.push(false);
			} else {
				row.push(true);
			}
		}

		for (var i=0; i < row.length; i++) {
			UI.addBlock(row[i], targetTower)
		}
	};

	UI.prototype.clearGame = function() {
		$(".block").remove();
		$(".block-full").remove();
	}



})();

$(document).ready(function() {
	var game = new Hanoi.Game();
	var uiObject = new Hanoi.UI(game, document);
	uiObject.render();

	$('.game').on('click', uiObject.eachClick.bind(uiObject));

});