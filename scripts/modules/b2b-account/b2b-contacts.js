define([
    "modules/jquery-mozu",
    'modules/api',
    "underscore",
    "hyprlive",
    "modules/backbone-mozu",
    "hyprlivecontext",     
    "modules/models-customer",
    'modules/mozu-grid/mozugrid-view',
    'modules/mozu-grid/mozugrid-pagedCollection',   
    "modules/views-paging",
    'modules/editable-view',
    "modules/models-quotes",
    "modules/models-b2bcontacts"], 
    function ($, api, _, Hypr, Backbone, HyprLiveContext, CustomerModels, MozuGrid, MozuGridCollection,
    PagingViews, EditableView, QuoteModels, B2bModels) {
      
    var B2bContactsMozuGrid = MozuGrid.extend({
        render: function () {
            var self = this;
            MozuGrid.prototype.render.apply(self, arguments);
        }
    });

    var B2bContactsView = Backbone.MozuView.extend({
        templateName: "modules/b2b-account/account-search/accounts-search",
        initialize: function () {       
          Backbone.MozuView.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var self = this;
            Backbone.MozuView.prototype.render.apply(this, arguments);
            var collection = new B2bContactsGridCollectionModel({ autoload: true });          
            this.initializeGrid(collection);            
            this.$modal = this.$('.modal');
        },      
        initializeGrid: function (collection) {
            var self = this;
            self._b2bContactGridView = new B2bContactsMozuGrid({
                el: $('.mz-b2b-quotes-grid'),
                model: collection
            });           
        },
        show: function() {
            this.$el.modal('show');
          },
        renderView: function(template) {
            this.$el.html(this.template);
            this.$el.modal({show:true}); // dont show modal on instantiation
          },
        registerRowActions: function () {
            var self = this;
            var rowActions = this.model.get('rowActions');
            _.each(rowActions, function (action) {
                self[action.action] = function (e) {
                    var rowNumber = $(e.target).parents('.mz-grid-row').data('mzRowIndex');
                    var row = self.model.get('items').at(rowNumber - 1);
                    self.model[action.action](e, row);
                };
            });
        }  
       
    });  

    var B2bContactsGridCollectionModel= MozuGridCollection.extend({
        mozuType: 'quotes',
        defaultSort: 'submittedDate desc',
        columns: [
            {
                index: 'name',
                displayName: 'Quote Name',
                sortable: false
            },
            {
                index: 'expirationDate',
                displayName: 'Expiration Date',
                sortable: true,
                displayTemplate: function (value) {
                    var date = "";
                    if (value) {
                        date = new Date(value).toLocaleString();
                    }
                    return date;
                }
            },
            {
                index: 'submittedDate',
                displayName: 'Submitted Date',
                sortable: true,
                displayTemplate: function (value) {
                    var date = "";
                    if (value) {
                        date = new Date(value).toLocaleString();
                    }
                    return date;
                }
            },
            {
                index: 'total',
                displayName: 'Total',
                sortable: false,
                displayTemplate: function (amount) {
                    return '$' + amount.toFixed(2);
                }
            },
            {
                index: 'status',
                displayName: 'Status',
                sortable: false
            }
        ],
        rowActions: [
            {
                displayName: 'Edit Quote',
                action: 'editQuote'
            },
            {
                displayName: 'Delete Quote',
                action: 'deleteQuote'
            },
            {
                displayName: 'Copy Quote',
                action: 'copyQuote'
            },
            {
                displayName: 'Email Quote',
                action: 'emailQuote'
            }
        ],
        relations: {
            items: Backbone.Collection.extend({
                model: QuoteModels.Quote
            })
        },
        editQuote: function (e, row) {
            var quoteId = row.get('id');
            window.location = '/myaccount/quote/' + quoteId + '/edit';
        },
        deleteQuote: function () {
            this.trigger('deleteQuoteView');
        },
        copyQuote: function () {
            this.set('copyQuoteView');
        },
        emailQuote: function () {
            this.set('emailQuoteView');
        }
    });
    
    // var B2bContactsGridCollectionModel = MozuGridCollection.extend({
    //     mozuType: 'b2bcontacts',       
    //     columns: [
    //         {
    //             index: 'accountName',
    //             displayName: 'Account Name',
    //             sortable: false
    //         }           
    //     ],relations: {
    //         items: Backbone.Collection.extend({
    //             model: B2bModels.B2bContact
    //         })
    //     }      
    // });

    return {
        'B2bContactsView': B2bContactsView     
    };
});